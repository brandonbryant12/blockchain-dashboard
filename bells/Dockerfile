# Use a base image
FROM debian:stable-slim

# Set environment variables
ENV BINARY_DIR=/opt/bells-3.0.0-rc2/bin
ENV DAEMON_BINARY=bellsd
ENV DATA_DIR=/data
ENV BELL_CONF_DIR=/bells
ENV BELL_CONF_FILE=/bells/bitcoin.conf

# Install dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends wget tar ca-certificates libstdc++6 && \
    rm -rf /var/lib/apt/lists/*

# Download and extract BellscoinV3
RUN wget -O /tmp/bellscoinV3.tar.gz "https://github.com/Nintondo/bellscoinV3/releases/download/v3.0.0-rc2/bells-3.0.0-rc2-x86_64-linux-gnu.tar.gz" && \
    tar -xzf /tmp/bellscoinV3.tar.gz -C /opt && \
    rm /tmp/bellscoinV3.tar.gz

# Create necessary directories and set permissions
RUN mkdir -p ${DATA_DIR} ${BELL_CONF_DIR} && \
    useradd -m bellscoinuser && \
    chown -R bellscoinuser:bellscoinuser ${DATA_DIR} ${BELL_CONF_DIR} /opt/bells-3.0.0-rc2

# Switch to non-root user
USER bellscoinuser

# Set the working directory to where bellsd is located
WORKDIR ${BINARY_DIR}

# Expose ports
EXPOSE 8332 8333
