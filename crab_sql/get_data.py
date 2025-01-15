import sqlite3
from .settings import DATABASE_NAME


class GetData:
    @staticmethod
    def get_data(
        table_name: str,
        fields: list[str],
        latest: bool = False,
        datetime_field: str = None,
        limit: int = 1,
    ):
        """
        Fetches data from a given table.

        :latest: If True, fetches the latest rows based on a time field.
        :datetime_field: The name of the time field to sort by (e.g., 'created').
        :limit: The number of latest rows to fetch (default is 1).
        """
        if latest and not datetime_field:
            raise ValueError(
                "A time field name must be specified when using latest=True."
            )

        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()

        all_fields = ", ".join(fields)
        query = f"SELECT {all_fields} FROM {table_name}"

        if latest:
            query += f" ORDER BY {datetime_field} DESC"

        if latest and limit > 0:
            query += f" LIMIT {limit}"

        cursor.execute(query)
        print("Operation Completed..Status..Ok...")

        rows = cursor.fetchall()
        conn.close()
        return rows
