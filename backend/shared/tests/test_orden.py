import pytest
import re
from typing import Required, TypedDict

class Orden(TypedDict):
    id: Required[int]
    fecha: Required[str]
    planta: Required[str]
    centroDistribucion: Required[str]
    producto: Required[str]
    cantidad: Required[int]
    estado: Required[str]

ESTADO_VALUES = {'pendiente', 'despachado', 'entregado'}

def validate_fecha(fecha: str) -> bool:
    pattern = r'^\d{4}-\d{2}-\d{2}$'
    return bool(re.match(pattern, fecha))

def validate_orden(data: dict) -> tuple[bool, str | None]:
    for field in ['id', 'fecha', 'planta', 'centroDistribucion', 'producto', 'cantidad', 'estado']:
        if field not in data:
            return False, field
    if data['estado'] not in ESTADO_VALUES:
        return False, 'estado'
    if not validate_fecha(data['fecha']):
        return False, 'fecha'
    if not isinstance(data['cantidad'], int) and not isinstance(data['cantidad'], float):
        return False, 'cantidad'
    for field in ['planta', 'centroDistribucion', 'producto']:
        if isinstance(data.get(field), str) and data[field] == '':
            return False, field
    return True, None

def test_backend_orden_interface_accepts_valid_fields():
    data = {'id': 2, 'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 200, 'estado': 'despachado'}
    valid, _ = validate_orden(data)
    assert valid is True

def test_backend_create_orden_dto_invalid_cantidad_type():
    data = {'id': 1, 'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 'two hundred', 'estado': 'pendiente'}
    valid, error_field = validate_orden(data)
    assert valid is False
    assert error_field == 'cantidad'

def test_backend_orden_interface_empty_string_fields():
    data = {'id': 3, 'fecha': '', 'planta': '', 'centroDistribucion': '', 'producto': '', 'cantidad': 50, 'estado': 'entregado'}
    valid, error_field = validate_orden(data)
    assert valid is False
    assert error_field == 'fecha'