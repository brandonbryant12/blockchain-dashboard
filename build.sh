#!/bin/bash

# Check if .env file exists, if not, generate it
if [ ! -f .env ]; then
    echo "Generating .env file with random credentials..."
    BTC_RPC_USER="btcuser$(openssl rand -hex 5)"
    BTC_RPC_PASSWORD=$(openssl rand -hex 16)
    FRACTAL_RPC_USER="fractaluser$(openssl rand -hex 5)"
    FRACTAL_RPC_PASSWORD=$(openssl rand -hex 16)
    MASTER_PASSWORD=$(openssl rand -hex 16)
    JWT_SECRET=$(openssl rand -hex 32)
    BTC_RPC_HOST="127.0.0.1"
    BTC_RPC_PORT="8332"
    FRACTAL_RPC_HOST="127.0.0.1"
    FRACTAL_RPC_PORT="18332"

    cat << EOF > .env
BTC_RPC_USER=${BTC_RPC_USER}
BTC_RPC_PASSWORD=${BTC_RPC_PASSWORD}
BTC_RPC_HOST=${BTC_RPC_HOST}
BTC_RPC_PORT=${BTC_RPC_PORT}
FRACTAL_RPC_USER=${FRACTAL_RPC_USER}
FRACTAL_RPC_PASSWORD=${FRACTAL_RPC_PASSWORD}
FRACTAL_RPC_HOST=${FRACTAL_RPC_HOST}
FRACTAL_RPC_PORT=${FRACTAL_RPC_PORT}
MASTER_PASSWORD=${MASTER_PASSWORD}
JWT_SECRET=${JWT_SECRET}
EOF
    echo ".env file generated successfully."
else
    echo ".env file already exists. Using existing configuration."
fi
