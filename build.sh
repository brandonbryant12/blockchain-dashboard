#!/bin/bash

# Stop and remove containers
sudo docker-compose down

# Generate .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Generating .env file..."

    BTC_RPC_USER="btcuser$(openssl rand -hex 5)"
    BTC_RPC_PASSWORD=$(openssl rand -hex 16)"
    FRACTAL_RPC_USER="fractaluser$(openssl rand -hex 5)"
    FRACTAL_RPC_PASSWORD=$(openssl rand -hex 16)"
    MASTER_PASSWORD=$(openssl rand -hex 16)"
    JWT_SECRET=$(openssl rand -hex 32)"

    cat <<EOF > .env
BTC_RPC_USER=${BTC_RPC_USER}
BTC_RPC_PASSWORD=${BTC_RPC_PASSWORD}
BTC_RPC_HOST=btc-node
BTC_RPC_PORT=8332
FRACTAL_RPC_USER=${FRACTAL_RPC_USER}
FRACTAL_RPC_PASSWORD=${FRACTAL_RPC_PASSWORD}
FRACTAL_RPC_HOST=fractal-node
FRACTAL_RPC_PORT=18332
MASTER_PASSWORD=${MASTER_PASSWORD}
JWT_SECRET=${JWT_SECRET}
EOF

    echo ".env file generated."
else
    echo ".env file already exists."
fi

# Start the services
sudo docker-compose up --build -d
