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

class CreateOrdenDto(TypedDict):
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
    if not isinstance(data['cantidad'], int):
        return False, 'cantidad'
    return True, None

def validate_create_orden_dto(data: dict) -> tuple[bool, str | None]:
    for field in ['fecha', 'planta', 'centroDistribucion', 'producto', 'cantidad', 'estado']:
        if field not in data:
            return False, field
    if data['estado'] not in ESTADO_VALUES:
        return False, 'estado'
    if not validate_fecha(data['fecha']):
        return False, 'fecha'
    if not isinstance(data['cantidad'], int):
        return False, 'cantidad'
    return True, None

def test_orden_interface_accepts_valid_fields():
    data = {'id': 1, 'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': 100, 'estado': 'pendiente'}
    valid, _ = validate_orden(data)
    assert valid is True

def test_create_orden_dto_missing_required_field():
    data = {'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': 100}
    valid, error_field = validate_create_orden_dto(data)
    assert valid is False
    assert error_field == 'estado'

def test_orden_interface_invalid_estado_value():
    data = {'id': 1, 'fecha': '2024-06-01', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto A', 'cantidad': 100, 'estado': 'cancelado'}
    valid, error_field = validate_orden(data)
    assert valid is False
    assert error_field == 'estado'