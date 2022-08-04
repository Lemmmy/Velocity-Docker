#!/bin/sh

set -e

# Pass JVM_XMS and JVM_XMX as environment variables to the container to adjust
# the memory allocated to Velocity's JVM.
xms=${JVM_XMS:-512M}
xmx=${JVM_XMX:-512M}

# https://docs.papermc.io/velocity/getting-started
exec java \
  -Xms"$xms" -Xmx"$xmx" \
  -XX:+UseG1GC \
  -XX:G1HeapRegionSize=4M \
  -XX:+UnlockExperimentalVMOptions \
  -XX:+ParallelRefProcEnabled \
  -XX:+AlwaysPreTouch \
  -XX:MaxInlineLevel=15 \
  -jar /app/velocity*.jar
