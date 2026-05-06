import pytest
import sqlite3
from typing import Any, List

class DbService:
    def __init__(self, db_url: str = ':memory:'):
        self.conn = sqlite3.connect(db_url)
        self.conn.execute('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, value TEXT)')

    def query(self, sql: str, params: List[Any] = None) -> List[Any]:
        cursor = self.conn.execute(sql, params or [])
        return cursor.fetchall()

    def execute(self, sql: str, params: List[Any] = None) -> None:
        self.conn.execute(sql, params or [])
        self.conn.commit()

def test_db_service_connect_and_query():
    db = DbService()
    result = db.query('SELECT 1')
    assert result == [(1,)]

def test_db_service_insert_and_retrieve_row():
    db = DbService()
    db.execute("INSERT INTO test (value) VALUES ('abc')")
    result = db.query('SELECT value FROM test WHERE id=1')
    assert result == [('abc',)]

def test_db_service_query_invalid_sql_raises_error():
    db = DbService()
    with pytest.raises(sqlite3.OperationalError):
        db.query('SELECT * FROM non_existing_table')