from typing import Any

from crab_sql.crabmodel import CrabModel
from crab_sql.datatypes import DataTypes


class ScanResult(CrabModel):
    _columns: dict[str, Any] = {
        "ips": DataTypes.varchar(unique=True),
        "macs": DataTypes.varchar(unique=True),
        "created_at": DataTypes.datetimefield(auto_add_now=True),
    }
