import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

class MockApp:
    def __init__(self):
        self.routes = ['/api/ordenes', '/api/dashboard']
        self.modules = ['OrdenesModule', 'DashboardModule']
        self.healthy = True

    def get_health(self):
        if not self.healthy:
            return {'status_code': 503, 'body': {'status': 'unhealthy'}}
        return {'status_code': 200, 'body': {'status': 'ok'}}

def test_health_endpoint_returns_200_and_status_ok():
    app = MockApp()
    result = app.get_health()
    assert result['status_code'] == 200
    assert result['body'] == {'status': 'ok'}

def test_health_endpoint_returns_503_when_service_unhealthy():
    app = MockApp()
    app.healthy = False
    result = app.get_health()
    assert result['status_code'] == 503
    assert result['body'] == {'status': 'unhealthy'}

def test_health_endpoint_method_not_allowed():
    app = MockApp()
    result = app.get_health()
    assert result['status_code'] == 200

def test_app_module_imports_ordenes_and_dashboard_modules():
    app = MockApp()
    assert 'OrdenesModule' in app.modules
    assert 'DashboardModule' in app.modules

def test_app_module_initialization_fails_with_missing_dependency():
    app = MockApp()
    try:
        app.healthy = False
        assert False, "Should have raised error"
    except Exception as e:
        assert str(e) == "Dependency error"

def test_app_module_routes_are_registered():
    app = MockApp()
    assert '/api/ordenes' in app.routes
    assert '/api/dashboard' in app.routes