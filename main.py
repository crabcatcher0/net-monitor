import os

import uvicorn
from fastapi import FastAPI
from fastapi import HTTPException

from schema import ScanModel
from utils import scan_network
from utils import extract_ip_and_mac

tags_metadata = [
    {
        "name": "Network",
        "description": "Network Related Operations",
    },
]
app = FastAPI(openapi_tags=tags_metadata)


@app.post("/scan/", tags=["Network"])
def scan_the_network(payload: ScanModel):
    scan_network(
        gateway_ip=payload.network_gateway, root_password=payload.root_password
    )
    return {"message": "Scanned completed."}


@app.get("/scan-result/", tags=["Network"])
def list_scan_result():
    data = extract_ip_and_mac()
    return {"result": data}


@app.get("/remove-logs/", tags=["Network"])
def delete_logs():
    file_path = "scan_result.txt"
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return {"message": "Successfully cleared logs."}
        else:
            raise HTTPException(
                status_code=404, detail="[!] Logs might already be cleared."
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{str(e)}")


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
