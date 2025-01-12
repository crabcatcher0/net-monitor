import os
from datetime import datetime

import uvicorn
from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from schema import ScanModel
from utils import scan_network
from utils import extract_ip_and_mac
from utils import convert_to_csv

tags_metadata = [
    {
        "name": "Network",
        "description": "Network Related Operations",
    },
    {
        "name": "General",
        "description": "General utils",
    },
]

app = FastAPI(openapi_tags=tags_metadata)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/scan/", tags=["Network"])
def scan_the_network(payload: ScanModel):
    scan_network(gateway_ip=payload.network_gateway)
    dt = datetime.now()
    return {"message": f"Network scan completed at {dt.strftime("%Y/%m/%d %H:%M")}."}


@app.get("/scan-result/", tags=["Network"])
def list_scan_result():
    data = extract_ip_and_mac()
    return {"result": data}


@app.get("/remove-logs/", tags=["Network"])
def clear_scan_logs():
    files_to_remove = ["scan_result.txt", "scan-result.csv"]
    try:
        for file in files_to_remove:
            if os.path.exists(file):
                os.remove(file)
                return {"message": "Successfully cleared logs."}
            else:
                raise HTTPException(
                    status_code=404, detail="[!] Logs might already be cleared."
                )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{str(e)}")


@app.get("/save-scan-result/", tags=["General"])
def download_scan_result():
    try:
        file = convert_to_csv()

        if not os.path.exists(file):
            raise HTTPException(status_code=500, detail="[!] File service error.")

        return FileResponse(file, status_code=200)

    except Exception:
        raise HTTPException(status_code=500, detail="[!] Please perform a scan")


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
