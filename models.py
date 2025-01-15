from typing import Any

from crab_sql.crabmodel import CrabModel
from crab_sql.datatypes import DataTypes


class ScanResult(CrabModel):
    _columns: dict[str, Any] = {
        "file_name": DataTypes.varchar(max_length=15),
        "file": DataTypes.file(),
        "created": DataTypes.datetimefield(auto_add_now=True),
    }
