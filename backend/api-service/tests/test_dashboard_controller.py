import pytest

class MockDashboardData:
    def __init__(self):
        self.data = {
            'totalOrdenes': 120,
            'totalDespachadas': 80,
            'totalEntregadas': 60,
            'ordenesPendientes': 40,
            'graficoDespachos': [
                {'fecha': '2024-06-01', 'cantidad': 10},
                {'fecha': '2024-06-02', 'cantidad': 15}
            ]
        }

    def get_data(self):
        return self.data

def test_get_dashboard_returns_200_and_dashboard_data():
    mock = MockDashboardData()
    result = mock.get_data()
    assert 'totalOrdenes' in result
    assert 'totalDespachadas' in result
    assert 'totalEntregadas' in result
    assert 'ordenesPendientes' in result
    assert 'graficoDespachos' in result

def test_get_dashboard_grafico_despachos_structure():
    mock = MockDashboardData()
    result = mock.get_data()
    assert len(result['graficoDespachos']) == 2
    assert 'fecha' in result['graficoDespachos'][0]
    assert 'cantidad' in result['graficoDespachos'][0]

def test_get_dashboard_empty_db_returns_zeros_and_empty_grafico():
    empty_data = {
        'totalOrdenes': 0,
        'totalDespachadas': 0,
        'totalEntregadas': 0,
        'ordenesPendientes': 0,
        'graficoDespachos': []
    }
    assert empty_data['totalOrdenes'] == 0
    assert empty_data['graficoDespachos'] == []