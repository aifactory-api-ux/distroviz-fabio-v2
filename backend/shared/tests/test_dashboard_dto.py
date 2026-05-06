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

ESTADO_VALUES = {'pendiente', 'despachado', 'entregado'}

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
    if not isinstance(data['graficoDespachos'], list):
        return False, 'graficoDespachos'
    for i, item in enumerate(data['graficoDespachos']):
        valid, err = validate_grafico_despachos(item)
        if not valid:
            return valid, f'graficoDespachos[{i}].{err}'
    return True, None

def test_dashboard_data_interface_accepts_valid_data():
    data = {'totalOrdenes': 120, 'totalDespachadas': 80, 'totalEntregadas': 60, 'ordenesPendientes': 40, 'graficoDespachos': [{'fecha': '2024-06-01', 'cantidad': 10}, {'fecha': '2024-06-02', 'cantidad': 15}]}
    valid, _ = validate_dashboard_data(data)
    assert valid is True

def test_dashboard_data_missing_required_field_raises_error():
    data = {'totalOrdenes': 120, 'totalDespachadas': 80, 'ordenesPendientes': 40, 'graficoDespachos': [{'fecha': '2024-06-01', 'cantidad': 10}]}
    valid, error_field = validate_dashboard_data(data)
    assert valid is False
    assert error_field == 'totalEntregadas'

def test_dashboard_data_grafico_despachos_invalid_fecha_format_raises_error():
    data = {'totalOrdenes': 120, 'totalDespachadas': 80, 'totalEntregadas': 60, 'ordenesPendientes': 40, 'graficoDespachos': [{'fecha': '01-06-2024', 'cantidad': 10}]}
    valid, error_field = validate_dashboard_data(data)
    assert valid is False
    assert error_field == 'graficoDespachos[0].fecha'

def test_dashboard_data_grafico_despachos_empty_array_is_valid():
    data = {'totalOrdenes': 120, 'totalDespachadas': 80, 'totalEntregadas': 60, 'ordenesPendientes': 40, 'graficoDespachos': []}
    valid, _ = validate_dashboard_data(data)
    assert valid is True

def test_dashboard_data_negative_total_ordenes_raises_error():
    data = {'totalOrdenes': -1, 'totalDespachadas': 80, 'totalEntregadas': 60, 'ordenesPendientes': 40, 'graficoDespachos': [{'fecha': '2024-06-01', 'cantidad': 10}]}
    valid, error_field = validate_dashboard_data(data)
    assert valid is False
    assert error_field == 'totalOrdenes'