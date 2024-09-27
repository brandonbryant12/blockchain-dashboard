#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Function to generate a random string
generate_random_string() {
    openssl rand -base64 12 | tr -dc 'a-zA-Z0-9' | head -c 16
}

# Generate .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Generating .env file..."
    
    # Generate random passwords
    BTC_RPC_PASSWORD=$(generate_random_string)
    FRACTAL_RPC_PASSWORD=$(generate_random_string)
    BELLS_RPC_PASSWORD=$(generate_random_string)
    
    # Create .env file
    cat << EOF > .env
BTC_RPC_USER=rpcuser
BTC_RPC_PASSWORD=$BTC_RPC_PASSWORD
BTC_RPC_PORT=1000
BTC_RPC_URL=http://rpcuser:$BTC_RPC_PASSWORD@btc.nodemaster.online

FRACTAL_RPC_USER=rpcuser
FRACTAL_RPC_PASSWORD=$FRACTAL_RPC_PASSWORD
FRACTAL_RPC_PORT=1001
FRACTAL_RPC_URL=http://rpcuser:$FRACTAL_RPC_PASSWORD@fractal.nodemaster.online

BELLS_RPC_USER=rpcuser
BELLS_RPC_PASSWORD=$BELLS_RPC_PASSWORD
BELLS_RPC_PORT=1002
BELLS_RPC_URL=http://rpcuser:$BELLS_RPC_PASSWORD@bells.nodemaster.online
EOF

    echo ".env file generated successfully."
else
    echo ".env file already exists. Skipping generation."
fi


# Create bitcoin.conf files for each node
create_bitcoin_conf "btc" "$BTC_RPC_USER" "$BTC_RPC_PASSWORD" "$BTC_RPC_PORT"
create_bitcoin_conf "fractal" "$FRACTAL_RPC_USER" "$FRACTAL_RPC_PASSWORD" "$FRACTAL_RPC_PORT"
create_bitcoin_conf "bells" "$BELLS_RPC_USER" "$BELLS_RPC_PASSWORD" "$BELLS_RPC_PORT"

# Create .env file for the dashboard
cat << EOF > dashboard/.env
NEXT_PUBLIC_BTC_RPC_URL=$BTC_RPC_URL
NEXT_PUBLIC_FRACTAL_RPC_URL=$FRACTAL_RPC_URL
NEXT_PUBLIC_BELLS_RPC_URL=$BELLS_RPC_URL
EOF

echo "Configuration files created successfully."

# Build and start the containers
docker-compose build
docker-compose up -d

echo "Blockchain nodes and dashboard are now running."