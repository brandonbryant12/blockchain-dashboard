#!/bin/bash
sudo docker-compose down

# Function to generate and set environment variables
generate_and_set_env() {
    BTC_RPC_USER="btcuser$(openssl rand -hex 5)"
    BTC_RPC_PASSWORD=$(openssl rand -hex 16)
    BTC_RPC_HOST="127.0.0.1"
    BTC_RPC_PORT="8332"
    FRACTAL_RPC_USER="fractaluser$(openssl rand -hex 5)"
    FRACTAL_RPC_PASSWORD=$(openssl rand -hex 16)
    FRACTAL_RPC_HOST="127.0.0.1"
    FRACTAL_RPC_PORT="18332"
    MASTER_PASSWORD=$(openssl rand -hex 16)
    JWT_SECRET=$(openssl rand -hex 32)

    # Export variables to make them available in the current session
    export BTC_RPC_USER BTC_RPC_PASSWORD BTC_RPC_HOST BTC_RPC_PORT
    export FRACTAL_RPC_USER FRACTAL_RPC_PASSWORD FRACTAL_RPC_HOST FRACTAL_RPC_PORT
    export MASTER_PASSWORD JWT_SECRET

    # Generate .env file content
    env_content="BTC_RPC_USER=${BTC_RPC_USER}
BTC_RPC_PASSWORD=${BTC_RPC_PASSWORD}
BTC_RPC_HOST=${BTC_RPC_HOST}
BTC_RPC_PORT=${BTC_RPC_PORT}
FRACTAL_RPC_USER=${FRACTAL_RPC_USER}
FRACTAL_RPC_PASSWORD=${FRACTAL_RPC_PASSWORD}
FRACTAL_RPC_HOST=${FRACTAL_RPC_HOST}
FRACTAL_RPC_PORT=${FRACTAL_RPC_PORT}
MASTER_PASSWORD=${MASTER_PASSWORD}
JWT_SECRET=${JWT_SECRET}"

    echo "$env_content" > .env
    echo ".env file generated and variables set in current environment."
}

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Generating .env file and setting environment variables..."
    generate_and_set_env
else
    echo ".env file already exists. Loading existing configuration..."
    # Load existing environment variables
    set -a
    source .env
    set +a
fi

# Verify that variables are set
echo "Environment variables set:"
echo "BTC RPC User: $BTC_RPC_USER"
echo "BTC RPC Host: $BTC_RPC_HOST"
echo "BTC RPC Port: $BTC_RPC_PORT"
echo "FRACTAL RPC User: $FRACTAL_RPC_USER"
echo "FRACTAL RPC Host: $FRACTAL_RPC_HOST"
echo "FRACTAL RPC Port: $FRACTAL_RPC_PORT"
echo "MASTER_PASSWORD is set: ${MASTER_PASSWORD:+yes}"
echo "JWT_SECRET is set: ${JWT_SECRET:+yes}"

# Instructions for using the script
echo "
To use these variables in your current shell session, run this script with source:
    source ./build.sh
"

sudo cp .env ./dashboard/.env

sudo -E docker-compose up --build -d