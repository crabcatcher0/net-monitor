from typing import Dict, Any
from pydantic import BaseModel


class ScanResultModel(BaseModel):
    result: Dict[str, Any]


class GenericSchema(BaseModel):
    message: str
