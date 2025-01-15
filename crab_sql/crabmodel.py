import sqlite3
from .settings import DATABASE_NAME


class CrabModel:
    """
    :: Creates database tables with auto-incremented primary keys.
    - Foreign Keys are if given it creates the table with it too.
    - Constructs the column and optional foreign key constraints.
    """

    @classmethod
    def create(cls, table_name: str, column: dict, foreign_keys: list = None):
        try:
            with sqlite3.connect(DATABASE_NAME) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}';"
                )
                result = cursor.fetchone()

                if result:
                    print(f"Table '{table_name}' already exists. Skipping...")
                else:
                    colmn_def = ", ".join(
                        [f"{col} {dtype}" for col, dtype in column.items()]
                    )
                    fk_constraints = (
                        ", " + ", ".join(foreign_keys) if foreign_keys else ""
                    )
                    cursor.execute(
                        f"""
                        CREATE TABLE {table_name} (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        {colmn_def}
                        {fk_constraints}
                        );
                        """
                    )
                    print(
                        f"Table '{table_name}' created.\nColumn: {', '.join(column.keys())} created."
                    )
        except sqlite3.OperationalError as e:
            print(f"OperationalError: {str(e)}")
        except Exception as e:
            print(f"Error: {str(e)}")

    @classmethod
    def add_column(cls, table_name: str, column_name: str, data_type: str):
        with sqlite3.connect(DATABASE_NAME) as conn:
            cursor = conn.cursor()
            cursor.execute(
                f"""
                PRAGMA table_info({table_name});
            """
            )
            columns = cursor.fetchall()
            column_names = [column[1] for column in columns]

            if column_name in column_names:
                print(f"Column '{column_name}' already exists... Skipping...")
            else:
                try:
                    cursor.execute(
                        f"""
                        ALTER TABLE {table_name}
                        ADD COLUMN {column_name} {data_type};
                """
                    )
                    print(f"Column '{column_name}' created.")
                except Exception as e:
                    print(f"Error: {str(e)}")

            conn.commit()

    @classmethod
    def insert(cls, column: dict):
        with sqlite3.connect(DATABASE_NAME) as conn:
            cursor = conn.cursor()

            columns = ", ".join(column.keys())
            placeholders = ", ".join(["?" for _ in column.values()])
            values = tuple(column.values())
            table_name = cls.__name__.lower()

            try:
                cursor.execute(
                    f"""
                    INSERT INTO {table_name} ({columns}) VALUES ({placeholders})
                """,
                    values,
                )

                print(f"Data added to {table_name}....")

            except Exception as e:
                print(f"Error: {str(e)}")

            conn.commit()

    @classmethod
    def delete(cls, pk: int):
        with sqlite3.connect(DATABASE_NAME) as conn:
            cursor = conn.cursor()
            table_name = cls.__name__.lower()
            try:
                cursor.execute(
                    f"""
                    DELETE FROM {table_name} WHERE id = ?;
                    """,
                    (pk,),
                )
                print(f"Data with id={pk} deleted....Ok..")

            except Exception as e:
                print(f"Error: {str(e)}")

            conn.commit()

    @classmethod
    def filter(cls, field: str, value, multiple_fields: dict = None):
        with sqlite3.connect(DATABASE_NAME) as conn:
            cursor = conn.cursor()
            model = cls.__name__.lower()
            result = []
            try:
                query = f"SELECT * FROM {model} WHERE {field} = ?"

                if multiple_fields:
                    additional_conditions = " AND ".join(
                        [f"{key} = ?" for key in multiple_fields.keys()]
                    )
                    query += f" AND {additional_conditions}"

                values = (
                    [value] + list(multiple_fields.values())
                    if multiple_fields
                    else [value]
                )

                cursor.execute(query, tuple(values))

                rows = cursor.fetchall()
                columns = [desc[0] for desc in cursor.description]

                result = [dict(zip(columns, row)) for row in rows]

            except Exception as e:
                print(f"Database error on filter: {str(e)}")

            return result

    @classmethod
    def order_by(cls, column_name: str, descending: bool = False):
        """
        returns all records ordered by the specified column.
        """

        with sqlite3.connect(DATABASE_NAME) as conn:
            cursor = conn.cursor()
            model = cls.__name__.lower()
            order = "DESC" if descending else "ASC"

            try:
                query = f"SELECT * FROM {model} ORDER BY {column_name} {order}"
                cursor.execute(query)
                data = cursor.fetchall()
                columns = [desc[0] for desc in cursor.description]

                result = [dict(zip(columns, row)) for row in data]
                print("Operation Order by....OK")
            except Exception as e:
                print(f"Database error on order_by: {str(e)}")

            return result

    @classmethod
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        cls.table_name = cls.__name__.lower()
        cls.model = cls.__name__.lower()

        cls.create(table_name=cls.table_name, column=cls._columns)


class ForeignKey:
    """
    - create_foreignkey(field_name: str, referenced_table: str):
        generates a foreign key constraint for a column.
        - model: table_name
        - on_delete: CASCADE
    """

    @staticmethod
    def create_foreignkey(field_name: str, model: str, on_delete: str = None):
        constraints = []  # ON DELETE CASCADE
        if on_delete:
            constraints.append(f"ON DELETE {on_delete}")

        return (
            f"FOREIGN KEY ({field_name}) REFERENCES {model}(id) {' '.join(constraints)}"
        )
