# NOTE

This is an experimental repository and is not recommended to be used in production. For a more stable, tried-and-tested Docker solution for Velocity and BungeeCord, check out [itzg/docker-bungeecord](https://github.com/itzg/docker-bungeecord/). itzg's offering supports BungeeCord, Waterfall and Velocity, has a comprehensive collection of environment variables for configuration, updates the proxy software immediately on startup, and generally has much better support.

# Velocity-Docker

Automatically updated Docker images for the
[Velocity](https://github.com/PaperMC/Velocity) Minecraft server proxy by
PaperMC.

The latest version is automatically pulled every 6 hours. Currently, only the
latest version is built.

The Velocity configuration (`velocity.toml`) and `forwarding.secret` files are
available under the `/data` directory and are automatically generated on the
first start of the container.

## Usage (Docker Compose)

```yml
services:
  velocity:
    image: ghcr.io/lemmmy/velocity-docker:latest
    hostname: velocity
    environment:
      JVM_XMS: 1G # Optional, defaults to 512M
      JVM_XMX: 1G # Optional, defaults to 512M
    volumes:
      - ./velocity:/data
    ports:
      - 25577:25577
    restart: always
```

## License
This repository is licensed under 
[GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html).

[Velocity](https://github.com/PaperMC/Velocity) is licensed under 
[GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html). 
