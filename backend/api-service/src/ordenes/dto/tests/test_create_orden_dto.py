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
    if not validate_fecha(data['fecha']):
        return False, 'fecha'
    return True, None

def test_create_orden_dto_accepts_valid_data():
    data = {'fecha': '2024-06-04', 'planta': 'Planta Oeste', 'centroDistribucion': 'CD Oeste', 'producto': 'Producto D', 'cantidad': 400, 'estado': 'pendiente'}
    valid, _ = validate_create_orden_dto(data)
    assert valid is True

def test_create_orden_dto_missing_producto_field():
    data = {'fecha': '2024-06-04', 'planta': 'Planta Oeste', 'centroDistribucion': 'CD Oeste', 'cantidad': 400, 'estado': 'pendiente'}
    valid, error_field = validate_create_orden_dto(data)
    assert valid is False
    assert error_field == 'producto'

def test_create_orden_dto_invalid_fecha_format():
    data = {'fecha': '04-06-2024', 'planta': 'Planta Oeste', 'centroDistribucion': 'CD Oeste', 'producto': 'Producto D', 'cantidad': 400, 'estado': 'pendiente'}
    valid, error_field = validate_create_orden_dto(data)
    assert valid is False
    assert error_field == 'fecha'