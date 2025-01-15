"""
    : Datatypes
"""


class DataTypes:

    @staticmethod
    def varchar(max_length: int = 255, unique: bool = False):
        unique_const = "UNIQUE" if unique else ""
        return f"VARCHAR({max_length}) NOT NULL {unique_const}".strip()

    @staticmethod
    def integer():
        return "INTEGER NOT NULL"

    @staticmethod
    def boolean():
        return "BOOLEAN"

    @staticmethod
    def emailfield(unique: bool = True):
        if unique:
            return "VARCHAR(255) UNIQUE NOT NULL"
        else:
            return "VARCHAR(255) UNIQUE NOT NULL"

    @staticmethod
    def datetimefield(auto_add_now: bool = True):
        if auto_add_now:
            return "DATETIME DEFAULT CURRENT_TIMESTAMP"

    @staticmethod
    def file():
        return "BLOB NOT NULL"

    @staticmethod
    def foreignkey(field_name: str, model: str):
        return (
            f"{field_name} INTEGER, FOREIGN KEY ({field_name}) REFERENCES {model}(id)"
        )
