import pytest

class MockOrden:
    def __init__(self, fecha, estado, cantidad):
        self.fecha = fecha
        self.estado = estado
        self.cantidad = cantidad

class MockDashboardService:
    def __init__(self, ordenes=None):
        self.ordenes = ordenes or [
            MockOrden('2024-06-01', 'despachado', 10),
            MockOrden('2024-06-01', 'despachado', 15),
            MockOrden('2024-06-02', 'pendiente', 5),
            MockOrden('2024-06-02', 'entregado', 20),
        ]

    def get_dashboard_data(self):
        total_ordenes = len(self.ordenes)
        total_despachadas = sum(1 for o in self.ordenes if o.estado == 'despachado')
        total_entregadas = sum(1 for o in self.ordenes if o.estado == 'entregado')
        ordenes_pendientes = sum(1 for o in self.ordenes if o.estado == 'pendiente')

        despachos_por_fecha = {}
        for o in self.ordenes:
            if o.estado == 'despachado':
                if o.fecha not in despachos_por_fecha:
                    despachos_por_fecha[o.fecha] = 0
                despachos_por_fecha[o.fecha] += o.cantidad

        grafico_despachos = [{'fecha': k, 'cantidad': v} for k, v in despachos_por_fecha.items()]

        return {
            'totalOrdenes': total_ordenes,
            'totalDespachadas': total_despachadas,
            'totalEntregadas': total_entregadas,
            'ordenesPendientes': ordenes_pendientes,
            'graficoDespachos': grafico_despachos
        }

def test_get_dashboard_data_returns_correct_totals():
    service = MockDashboardService()
    result = service.get_dashboard_data()
    assert result['totalOrdenes'] == 4
    assert result['totalDespachadas'] == 2
    assert result['totalEntregadas'] == 1
    assert result['ordenesPendientes'] == 1

def test_get_dashboard_data_grafico_despachos_matches_ordenes():
    service = MockDashboardService()
    result = service.get_dashboard_data()
    assert len(result['graficoDespachos']) == 1
    assert result['graficoDespachos'][0]['fecha'] == '2024-06-01'
    assert result['graficoDespachos'][0]['cantidad'] == 25

def test_get_dashboard_data_empty_db_returns_zeros_and_empty_grafico():
    service = MockDashboardService(ordenes=[])
    result = service.get_dashboard_data()
    assert result['totalOrdenes'] == 0
    assert result['totalDespachadas'] == 0
    assert result['totalEntregadas'] == 0
    assert result['ordenesPendientes'] == 0
    assert result['graficoDespachos'] == []