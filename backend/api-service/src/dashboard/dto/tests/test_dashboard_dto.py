import pytest
import re
from typing import Required, TypedDict

class GraficoDespachos(TypedDict):
    fecha: Required[str]
    cantidad: Required[int]

class DashboardData(TypedDict):
    totalOrdenes: Required[int]
    totalDespachadas: Required[int]
    totalEntregadas: Required[int]
    ordenesPendientes: Required[int]
    graficoDespachos: Required[list]

def validate_fecha(fecha: str) -> bool:
    pattern = r'^\d{4}-\d{2}-\d{2}$'
    return bool(re.match(pattern, fecha))

def validate_grafico_despachos(data: dict) -> tuple[bool, str | None]:
    if 'fecha' not in data:
        return False, 'fecha'
    if 'cantidad' not in data:
        return False, 'cantidad'
    if not validate_fecha(data['fecha']):
        return False, 'fecha'
    return True, None

def validate_dashboard_dto(data: dict) -> tuple[bool, str | None]:
    required_fields = ['totalOrdenes', 'totalDespachadas', 'totalEntregadas', 'ordenesPendientes', 'graficoDespachos']
    for field in required_fields:
        if field not in data:
            return False, field
    if not isinstance(data['graficoDespachos'], list):
        return False, 'graficoDespachos'
    return True, None

def test_dashboard_dto_accepts_valid_data():
    data = {'totalOrdenes': 50, 'totalDespachadas': 30, 'totalEntregadas': 20, 'ordenesPendientes': 10, 'graficoDespachos': [{'fecha': '2024-06-05', 'cantidad': 5}]}
    valid, _ = validate_dashboard_dto(data)
    assert valid is True

def test_dashboard_dto_missing_total_entregadas():
    data = {'totalOrdenes': 50, 'totalDespachadas': 30, 'ordenesPendientes': 10, 'graficoDespachos': [{'fecha': '2024-06-05', 'cantidad': 5}]}
    valid, error_field = validate_dashboard_dto(data)
    assert valid is False
    assert error_field == 'totalEntregadas'

def test_dashboard_dto_grafico_despachos_empty_array():
    data = {'totalOrdenes': 50, 'totalDespachadas': 30, 'totalEntregadas': 20, 'ordenesPendientes': 10, 'graficoDespachos': []}
    valid, _ = validate_dashboard_dto(data)
    assert valid is True