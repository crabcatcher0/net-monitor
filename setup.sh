#!/bin/bash

set -e

echo "Checking for required dependencies..."

sudo apt-get update

if ! command -v nmap &> /dev/null; then
    echo "Installing Nmap..."
    sudo apt-get install nmap -y
fi

if ! command -v npm &> /dev/null; then
    echo "Installing Node.js (includes npm)..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

if ! dpkg -l | grep -q python3-venv; then
    echo "Installing Python3 venv module..."
    sudo apt-get install python3-venv -y
fi

echo "Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

if [ -d "template" ]; then
    echo "Installing Node.js dependencies..."
    cd template
    npm install
    cd ..
else
    echo "Template directory not found. Skipping Node.js setup."
fi

echo "Setup complete. Execute run.sh ....."
