#!/usr/bin/env zx

// This script currently targets Velocity 3.x
const PROJECT = "velocity";
const VERSION_GROUP = "3.0.0";

const API = "https://api.papermc.io/v2";

/** Fetch the latest build from the PaperMC API. */
async function getLatestBuild() {
  const res = await fetch(`${API}/projects/${PROJECT}/version_group/${VERSION_GROUP}/builds`);
  const data = await res.json();
  const build = data.builds.sort((a, b) => b.build - a.build)[0];
  if (!build) throw new Error("No latest build found!");

  const download = build.downloads?.application;
  if (!download) throw new Error("No download found!");
  
  return {
    summary: build.changes?.[0].summary || "No change summary",

    version: build.version,
    number: build.build,

    filename: download.name,
    hash: download.sha256
  };
}

function getDownloadUrl(build) {
  return `${API}/projects/${PROJECT}/versions/${build.version}/builds/${build.number}/downloads/${build.filename}`;
}

const build = await getLatestBuild();

// If this is the same as our last version, stop here
const lastVersion = fs.readFileSync(".github/data/last_version", "utf8");
if (build.filename === lastVersion.trim()) {
  console.log(`No new version found!`);
  process.exit(0);
}

// Otherwise, begin updating the Dockerfile
console.log(`Found new version ${build.version}`);
fs.writeFileSync("sha256sums.txt", `${build.hash}  ${build.filename}\n`);

const downloadUrl = getDownloadUrl(build);
console.log(`Got download URL ${downloadUrl}`);

const dockerfile = fs.readFileSync("Dockerfile", "utf8");
fs.writeFileSync(
  "Dockerfile", 
  dockerfile.replace(/^(RUN curl -fsSLO) .+$/m, `$1 ${downloadUrl}`)
);

// Write last_version last, so that if this fails, it can be retried
fs.writeFileSync(".github/data/last_version", `${build.filename}\n`);

const versionName = `v${build.version}-${build.number}`.trim();
fs.writeFileSync(".github/data/version_name", versionName + "\n");

// Push the new Dockerfile
if (process.env.DEBUG === "true") process.exit(0);
await $`git config user.name github-actions`
await $`git config user.email github-actions@github.com`

await $`git add .`

const commitMessage = `ci(auto): update Velocity to ${versionName}\n\n${build.summary}`;
const gitAdd = $`git commit -F -`
gitAdd.stdin.write(commitMessage);
gitAdd.stdin.end();
await gitAdd;

await $`git tag ${versionName}`

await $`git push --atomic origin master ${versionName}`;
