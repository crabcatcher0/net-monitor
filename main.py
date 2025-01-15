import os
from datetime import datetime

import uvicorn
from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from crab_sql.get_data import GetData

from models import ScanResult
from schema import ScanModel
from schema import FileModel
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
    {"name": "Persistance Data", "description": "Related to Database"},
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
    files_removed: list[str] = []

    try:
        for file in files_to_remove:
            if os.path.exists(file):
                os.remove(file)
                files_removed.append(file)

        if not files_removed:
            raise HTTPException(
                status_code=404, detail="[!] Logs might already be cleared."
            )

        return {"message": f"Successfully cleared logs: {', '.join(files_removed)}."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/save-scan-result/", tags=["General"])
def download_scan_result():
    try:
        file = convert_to_csv()

        if not os.path.exists(file):
            raise HTTPException(status_code=500, detail="[!] File service error.")

        return FileResponse(file, status_code=200)

    except Exception:
        raise HTTPException(status_code=500, detail="[!] Please perform a scan")


############## Database Related ##############
##############################################


@app.post("/scan-and-save-db/", tags=["Persistance Data"])
def create_and_save_result(payload: FileModel):

    scan_network(gateway_ip=payload.scan_ip)

    file_path = "scan_result.txt"
    if os.path.exists(file_path):
        ScanResult.insert(  # type: ignore
            {"file_name": payload.file_name, "file": file_path}
        )
    return {"message": "Success on scan and saved to db."}


@app.get("/get-result-db/", tags=["Persistance Data"])
def view_data_from_db():
    data = GetData.get_data(table_name="scanresult", fields=["file_name", "file"])  # type: ignore
    return {"data": data}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
