#!/bin/bash

cleanup() {
    echo "Stopping Net-Monitor..."

    kill $frontend_pid

    pkill -f "uvicorn main:app"

    sudo fuser -k 5173/tcp
    sudo fuser -k 8001/tcp

    exit 0
}

trap cleanup SIGINT SIGTERM

source venv/bin/activate

cd template
npm run dev &
frontend_pid=$!

sleep 3

echo "  [!] Net Monitor is running..."

cd ..
uvicorn main:app --host 127.0.0.1 --port 8001 --log-level error

wait
