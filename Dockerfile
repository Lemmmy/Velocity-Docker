# ==============================================================================
# Downloads the latest version of Velocity.
# ==============================================================================
FROM alpine:latest AS download
WORKDIR /dl

RUN apk add curl

# Do not update this URL! It is updated automatically every 6 hours by the
# workflow at `.github/scripts/update-velocity.mjs`
RUN curl -fsSLO https://api.papermc.io/v2/projects/velocity/versions/3.1.2-SNAPSHOT/builds/185/downloads/velocity-3.1.2-SNAPSHOT-185.jar

# Verifies the sha256 checksum of the downloaded jar.
COPY sha256sums.txt .
RUN sha256sum -c sha256sums.txt

# ==============================================================================
# Runs Velocity.
# ==============================================================================
FROM eclipse-temurin:18-jre-alpine
WORKDIR /app

COPY --from=download /dl /app
COPY ./entrypoint.sh .

WORKDIR /data
ENTRYPOINT ["/app/entrypoint.sh"]
