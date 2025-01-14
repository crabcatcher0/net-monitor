#!/bin/bash

if ! command -v nmap &> /dev/null
then
    echo "Installing Nmap...."
    sudo apt-get install nmap -y
fi

if ! command -v npm &> /dev/null
then
    echo "Npm is not installed. Installing npm..."
    sudo apt-get install npm -y
    echo "Install npm and try running the setup."
    exit 1
fi

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

cd template
npm install

echo "Setup complete...."
