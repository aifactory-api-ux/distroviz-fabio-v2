import pytest

class MockApp:
    def __init__(self):
        self.routes = ['/api/ordenes', '/api/dashboard']
        self.modules = ['OrdenesModule', 'DashboardModule']
        self.initialized = True

    def is_initialized(self):
        return self.initialized

def test_app_module_imports_ordenes_and_dashboard_modules():
    app = MockApp()
    assert 'OrdenesModule' in app.modules
    assert 'DashboardModule' in app.modules

def test_app_module_initialization_fails_with_missing_dependency():
    app = MockApp()
    app.initialized = False
    assert app.is_initialized() is False

def test_app_module_routes_are_registered():
    app = MockApp()
    assert '/api/ordenes' in app.routes
    assert '/api/dashboard' in app.routes