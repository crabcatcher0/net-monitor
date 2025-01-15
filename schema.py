from typing import Dict, Any
from pydantic import BaseModel


class ScanResultModel(BaseModel):
    result: Dict[str, Any]


class ScanModel(BaseModel):
    network_gateway: str


class FileModel(BaseModel):
    scan_ip: str
    file_name: str
