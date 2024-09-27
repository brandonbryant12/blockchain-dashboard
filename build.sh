#!/bin/bash

# Function to get existing value from .env file
get_env_value() {
    local key=$1
    if [ -f .env ]; then
        grep "^${key}=" .env | cut -d '=' -f2
    fi
}

# Function to set or update a value in .env file
set_env_value() {
    local key=$1
    local value=$2
    if [ -f .env ] && grep -q "^${key}=" .env; then
        # If key exists, replace the line
        sed -i "s|^${key}=.*|${key}=${value}|" .env
    else
        # If key doesn't exist, append it
        echo "${key}=${value}" >> .env
    fi
}

# Stop and remove containers
sudo docker-compose down

# Check and update .env file
if [ ! -f .env ]; then
    touch .env
    echo ".env file created."
fi

# Check and set variables
variables=(
    "BTC_RPC_USER:btcuser$(openssl rand -hex 5)"
    "BTC_RPC_PASSWORD:$(openssl rand -hex 16)"
    "BTC_RPC_HOST:btc-node"
    "BTC_RPC_PORT:8332"
    "BELLS_RPC_USER:bellsuser$(openssl rand -hex 5)"
    "BELLS_RPC_PASSWORD:$(openssl rand -hex 16)"
    "BELLS_RPC_HOST:bells-node"
    "BELLS_RPC_PORT:22556"
    "FRACTAL_RPC_USER:fractaluser$(openssl rand -hex 5)"
    "FRACTAL_RPC_PASSWORD:$(openssl rand -hex 16)"
    "FRACTAL_RPC_HOST:fractal-node"
    "FRACTAL_RPC_PORT:8332"
    "MASTER_PASSWORD:$(openssl rand -hex 16)"
    "JWT_SECRET:$(openssl rand -hex 32)"
)

for var in "${variables[@]}"; do
    key="${var%%:*}"
    default_value="${var#*:}"
    current_value=$(get_env_value "$key")
    if [ -z "$current_value" ]; then
        set_env_value "$key" "$default_value"
        echo "$key has been added to .env file."
    fi
done

# Set RPC URL variables without port
btc_user=$(get_env_value "BTC_RPC_USER")
btc_pass=$(get_env_value "BTC_RPC_PASSWORD")
btc_host=$(get_env_value "BTC_RPC_HOST")
set_env_value "BTC_RPC_URL" "https://${btc_user}:${btc_pass}@${btc_host}"

bells_user=$(get_env_value "BELLS_RPC_USER")
bells_pass=$(get_env_value "BELLS_RPC_PASSWORD")
bells_host=$(get_env_value "BELLS_RPC_HOST")
set_env_value "BELLS_RPC_URL" "https://${bells_user}:${bells_pass}@${bells_host}"

fractal_user=$(get_env_value "FRACTAL_RPC_USER")
fractal_pass=$(get_env_value "FRACTAL_RPC_PASSWORD")
fractal_host=$(get_env_value "FRACTAL_RPC_HOST")
set_env_value "FRACTAL_RPC_URL" "https://${fractal_user}:${fractal_pass}@${fractal_host}"

echo ".env file has been updated with any missing variables and RPC URLs (without ports)."

# Start the services
sudo docker-compose up --build -d