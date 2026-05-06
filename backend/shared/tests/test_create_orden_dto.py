import pytest
import re
from typing import Required, TypedDict

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

def test_create_orden_dto_accepts_valid_data():
    data = {'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 200, 'estado': 'despachado'}
    valid, _ = validate_create_orden_dto(data)
    assert valid is True

def test_create_orden_dto_missing_required_field_raises_error():
    data = {'fecha': '2024-06-02', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 200, 'estado': 'despachado'}
    valid, error_field = validate_create_orden_dto(data)
    assert valid is False
    assert error_field == 'planta'

def test_create_orden_dto_invalid_estado_value_raises_error():
    data = {'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 200, 'estado': 'cancelado'}
    valid, error_field = validate_create_orden_dto(data)
    assert valid is False
    assert error_field == 'estado'

def test_create_orden_dto_zero_cantidad_is_valid():
    data = {'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 0, 'estado': 'pendiente'}
    valid, _ = validate_create_orden_dto(data)
    assert valid is True

def test_create_orden_dto_invalid_fecha_format_raises_error():
    data = {'fecha': '02-06-2024', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 200, 'estado': 'pendiente'}
    valid, error_field = validate_create_orden_dto(data)
    assert valid is False
    assert error_field == 'fecha'