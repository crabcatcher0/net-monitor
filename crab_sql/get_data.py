import sqlite3
from .settings import DATABASE_NAME


class GetData:

    @staticmethod
    def get_data(table_name: str, fields: list):
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()

        all_fields = ", ".join(fields)

        cursor.execute(
            f"""
            SELECT {all_fields} FROM {table_name};
        """
        )
        print("Operation Completed..Status..Ok...")

        rows = cursor.fetchall()
        conn.close()
        return rows
