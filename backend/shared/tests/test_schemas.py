import pytest
import sqlite3
from typing import Optional

ESTADO_VALUES = {'pendiente', 'despachado', 'entregado'}

class OrdenTable:
    def __init__(self):
        self.conn = sqlite3.connect(':memory:')
        self.conn.execute('''
            CREATE TABLE ordenes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fecha TEXT NOT NULL,
                planta TEXT NOT NULL,
                centroDistribucion TEXT NOT NULL,
                producto TEXT NOT NULL,
                cantidad INTEGER NOT NULL CHECK (cantidad >= 0),
                estado TEXT NOT NULL CHECK (estado IN ('pendiente', 'despachado', 'entregado'))
            )
        ''')

    def insert(self, data: dict) -> tuple[bool, Optional[str]]:
        required = ['fecha', 'planta', 'centroDistribucion', 'producto', 'cantidad', 'estado']
        for field in required:
            if field not in data:
                return False, field
        if data['estado'] not in ESTADO_VALUES:
            return False, 'estado'
        try:
            self.conn.execute(
                'INSERT INTO ordenes (fecha, planta, centroDistribucion, producto, cantidad, estado) VALUES (?, ?, ?, ?, ?, ?)',
                (data['fecha'], data['planta'], data['centroDistribucion'], data['producto'], data['cantidad'], data['estado'])
            )
            self.conn.commit()
            return True, None
        except Exception as e:
            return False, str(e)

    def get_all(self):
        cursor = self.conn.execute('SELECT fecha, planta, centroDistribucion, producto, cantidad, estado FROM ordenes')
        return cursor.fetchall()

def test_orden_table_schema_matches_data_contract():
    conn = sqlite3.connect(':memory:')
    cursor = conn.execute('''
        SELECT name, type FROM pragma_table_info('ordenes')
    ''')
    columns = cursor.fetchall()
    column_names = [c[0] for c in columns]
    assert 'id' in column_names
    assert 'fecha' in column_names
    assert 'planta' in column_names
    assert 'centroDistribucion' in column_names
    assert 'producto' in column_names
    assert 'cantidad' in column_names
    assert 'estado' in column_names

def test_orden_table_rejects_missing_required_fields():
    table = OrdenTable()
    success, error_field = table.insert({'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'cantidad': 100, 'estado': 'pendiente'})
    assert success is False
    assert error_field == 'producto'

def test_orden_table_estado_constraint_enforced():
    table = OrdenTable()
    success, _ = table.insert({'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': 100, 'estado': 'cancelado'})
    assert success is False

def test_orden_table_accepts_valid_insert_and_retrieves_data():
    table = OrdenTable()
    success, _ = table.insert({'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': 100, 'estado': 'pendiente'})
    assert success is True
    rows = table.get_all()
    assert len(rows) == 1
    assert rows[0] == ('2024-06-01', 'Planta Norte', 'CD Central', 'Producto A', 100, 'pendiente')

def test_orden_table_negative_cantidad_rejected():
    table = OrdenTable()
    success, error_field = table.insert({'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': -10, 'estado': 'pendiente'})
    assert success is False