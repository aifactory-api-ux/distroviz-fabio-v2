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

def validate_dashboard_data(data: dict) -> tuple[bool, str | None]:
    required_fields = ['totalOrdenes', 'totalDespachadas', 'totalEntregadas', 'ordenesPendientes', 'graficoDespachos']
    for field in required_fields:
        if field not in data:
            return False, field
    if data['totalOrdenes'] < 0:
        return False, 'totalOrdenes'
    if isinstance(data['graficoDespachos'], list):
        for item in data['graficoDespachos']:
            valid, err = validate_grafico_despachos(item)
            if not valid:
                return valid, err
    return True, None

def test_backend_dashboard_data_accepts_valid_fields():
    data = {'totalOrdenes': 10, 'totalDespachadas': 5, 'totalEntregadas': 3, 'ordenesPendientes': 2, 'graficoDespachos': [{'fecha': '2024-06-01', 'cantidad': 1}]}
    valid, _ = validate_dashboard_data(data)
    assert valid is True

def test_backend_dashboard_data_negative_numbers():
    data = {'totalOrdenes': -1, 'totalDespachadas': 0, 'totalEntregadas': 0, 'ordenesPendientes': 0, 'graficoDespachos': []}
    valid, error_field = validate_dashboard_data(data)
    assert valid is False
    assert error_field == 'totalOrdenes'

def test_backend_grafico_despachos_missing_cantidad():
    data = {'fecha': '2024-06-01'}
    valid, error_field = validate_grafico_despachos(data)
    assert valid is False
    assert error_field == 'cantidad'