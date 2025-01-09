import uvicorn

from fastapi import FastAPI

from utils import scan_network
from utils import extract_ip_and_mac

app = FastAPI()


@app.get("/scan-result/")
def list_scan_result():
    data = extract_ip_and_mac()
    return data


if __name__ == "__main__":
    gateway = input("Enter the network gateway (e.g., 192.168.1.0/24): ").strip()

    scan_network(gateway_ip=gateway)

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
