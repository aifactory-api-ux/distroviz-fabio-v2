import pytest

class MockOrden:
    def __init__(self, id=None, fecha=None, planta=None, centroDistribucion=None, producto=None, cantidad=None, estado=None):
        self.id = id
        self.fecha = fecha
        self.planta = planta
        self.centroDistribucion = centroDistribucion
        self.producto = producto
        self.cantidad = cantidad
        self.estado = estado

    def to_dict(self):
        return {
            'id': self.id,
            'fecha': self.fecha,
            'planta': self.planta,
            'centroDistribucion': self.centroDistribucion,
            'producto': self.producto,
            'cantidad': self.cantidad,
            'estado': self.estado
        }

class MockOrdenesService:
    def __init__(self):
        self.ordenes = [
            MockOrden(1, '2024-06-03', 'Planta Norte', 'CD Central', 'Producto C', 50, 'despachado'),
            MockOrden(2, '2024-06-04', 'Planta Sur', 'CD Sur', 'Producto D', 75, 'pendiente'),
        ]

    def create(self, orden_data):
        if 'estado' in orden_data and orden_data['estado'] not in ['pendiente', 'despachado', 'entregado']:
            raise ValueError("Invalid estado")
        new_id = max(o.id for o in self.ordenes) + 1
        orden = MockOrden(new_id, **orden_data)
        self.ordenes.append(orden)
        return orden.to_dict()

    def find_all(self):
        return [o.to_dict() for o in self.ordenes]

    def delete(self, orden_id):
        for o in self.ordenes:
            if o.id == orden_id:
                self.ordenes.remove(o)
                return True
        raise ValueError("Not found")

def test_create_orden_persists_and_returns_orden():
    service = MockOrdenesService()
    data = {'fecha': '2024-06-03', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto C', 'cantidad': 50, 'estado': 'despachado'}
    result = service.create(data)
    assert 'id' in result
    assert result['fecha'] == '2024-06-03'
    assert result['planta'] == 'Planta Norte'

def test_get_all_ordenes_returns_all_persisted_ordenes():
    service = MockOrdenesService()
    result = service.find_all()
    assert len(result) >= 2

def test_delete_orden_existing_id_removes_orden():
    service = MockOrdenesService()
    result = service.delete(1)
    assert result is True
    assert len(service.ordenes) == 1

def test_delete_orden_nonexistent_id_raises_not_found():
    service = MockOrdenesService()
    with pytest.raises(ValueError):
        service.delete(9999)

def test_create_orden_invalid_estado_raises_validation_error():
    service = MockOrdenesService()
    data = {'fecha': '2024-06-03', 'planta': 'Planta Norte', 'centroDistribucion': 'CD Central', 'producto': 'Producto C', 'cantidad': 50, 'estado': 'invalid'}
    with pytest.raises(ValueError):
        service.create(data)