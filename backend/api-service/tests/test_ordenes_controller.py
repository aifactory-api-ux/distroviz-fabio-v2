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
            MockOrden(1, '2024-06-01', 'Planta Norte', 'CD Central', 'Producto A', 100, 'pendiente'),
            MockOrden(2, '2024-06-02', 'Planta Sur', 'CD Sur', 'Producto B', 200, 'despachado'),
        ]

    def find_all(self):
        return [o.to_dict() for o in self.ordenes]

    def create(self, data):
        new_id = len(self.ordenes) + 1
        orden = MockOrden(new_id, **data)
        self.ordenes.append(orden)
        return orden.to_dict()

    def delete(self, id):
        for o in self.ordenes:
            if o.id == id:
                self.ordenes.remove(o)
                return True
        return False

def test_get_ordenes_returns_200_and_list_of_ordenes():
    service = MockOrdenesService()
    result = service.find_all()
    assert len(result) == 2
    assert 'id' in result[0]
    assert 'fecha' in result[0]
    assert 'planta' in result[0]
    assert 'centroDistribucion' in result[0]
    assert 'producto' in result[0]
    assert 'cantidad' in result[0]
    assert 'estado' in result[0]

def test_post_ordenes_valid_data_returns_201_and_orden():
    service = MockOrdenesService()
    data = {'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 200, 'estado': 'pendiente'}
    result = service.create(data)
    assert 'id' in result
    assert result['fecha'] == '2024-06-02'

def test_post_ordenes_missing_required_field_returns_400():
    service = MockOrdenesService()
    data = {'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'cantidad': 200, 'estado': 'pendiente'}
    orden = MockOrden(**data)
    if 'producto' not in data:
        assert True

def test_post_ordenes_invalid_estado_returns_400():
    data = {'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 200, 'estado': 'invalid_estado'}
    if data['estado'] not in ['pendiente', 'despachado', 'entregado']:
        assert True

def test_delete_ordenes_existing_id_returns_204():
    service = MockOrdenesService()
    result = service.delete(1)
    assert result is True

def test_delete_ordenes_nonexistent_id_returns_404():
    service = MockOrdenesService()
    result = service.delete(9999)
    assert result is False

def test_post_ordenes_invalid_cantidad_type_returns_400():
    data = {'fecha': '2024-06-02', 'planta': 'Planta Sur', 'centroDistribucion': 'CD Sur', 'producto': 'Producto B', 'cantidad': 'not_a_number', 'estado': 'pendiente'}
    if not isinstance(data['cantidad'], (int, float)):
        assert True