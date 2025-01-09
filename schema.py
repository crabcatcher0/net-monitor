from typing import Dict, Any
from pydantic import BaseModel
from pydantic import Field
from pydantic.networks import IPvAnyNetwork


class ScanResultModel(BaseModel):
    result: Dict[str, Any]


class GenericSchema(BaseModel):
    message: str


class ScanModel(BaseModel):
    network_gateway: IPvAnyNetwork
    root_password: str = Field(..., min_length=8, max_length=10)
