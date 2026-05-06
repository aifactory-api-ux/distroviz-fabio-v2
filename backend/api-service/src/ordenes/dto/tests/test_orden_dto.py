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

def validate_orden_dto(data: dict) -> tuple[bool, str | None]:
    for field in ['id', 'fecha', 'planta', 'centroDistribucion', 'producto', 'cantidad', 'estado']:
        if field not in data:
            return False, field
    if data['estado'] not in ESTADO_VALUES:
        return False, 'estado'
    if not isinstance(data['id'], int):
        return False, 'id'
    return True, None

def test_orden_dto_accepts_valid_data():
    data = {'id': 10, 'fecha': '2024-06-03', 'planta': 'Planta Este', 'centroDistribucion': 'CD Este', 'producto': 'Producto C', 'cantidad': 300, 'estado': 'entregado'}
    valid, _ = validate_orden_dto(data)
    assert valid is True

def test_orden_dto_missing_id_field():
    data = {'fecha': '2024-06-03', 'planta': 'Planta Este', 'centroDistribucion': 'CD Este', 'producto': 'Producto C', 'cantidad': 300, 'estado': 'entregado'}
    valid, error_field = validate_orden_dto(data)
    assert valid is False
    assert error_field == 'id'

def test_orden_dto_invalid_estado_type():
    data = {'id': 11, 'fecha': '2024-06-03', 'planta': 'Planta Este', 'centroDistribucion': 'CD Este', 'producto': 'Producto C', 'cantidad': 300, 'estado': 123}
    valid, error_field = validate_orden_dto(data)
    assert valid is False
    assert error_field == 'estado'