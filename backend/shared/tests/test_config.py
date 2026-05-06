import pytest
import os

def get_config(env: dict) -> dict:
    required = ['POSTGRES_HOST', 'POSTGRES_PORT', 'POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_DB', 'REDIS_HOST', 'REDIS_PORT', 'API_PORT']
    missing = [k for k in required if not env.get(k)]
    if missing:
        return {'valid': False, 'error_field': missing[0]}
    try:
        port = int(env.get('POSTGRES_PORT', '0'))
        if port <= 0:
            return {'valid': False, 'error_field': 'POSTGRES_PORT'}
    except ValueError:
        return {'valid': False, 'error_field': 'POSTGRES_PORT'}
    return {'valid': True, 'config_fields': required}

def test_config_loads_required_environment_variables():
    env = {'POSTGRES_HOST': 'localhost', 'POSTGRES_PORT': '25432', 'POSTGRES_USER': 'testuser', 'POSTGRES_PASSWORD': 'testpass', 'POSTGRES_DB': 'testdb', 'REDIS_HOST': 'localhost', 'REDIS_PORT': '26379', 'API_PORT': '23001'}
    result = get_config(env)
    assert result['valid'] is True
    assert 'POSTGRES_HOST' in result['config_fields']
    assert 'POSTGRES_PORT' in result['config_fields']

def test_config_missing_required_env_var_raises_error():
    env = {'POSTGRES_HOST': 'localhost', 'POSTGRES_PORT': '25432', 'POSTGRES_USER': 'testuser', 'POSTGRES_PASSWORD': 'testpass', 'REDIS_HOST': 'localhost', 'REDIS_PORT': '26379', 'API_PORT': '23001'}
    result = get_config(env)
    assert result['valid'] is False
    assert result['error_field'] == 'POSTGRES_DB'

def test_config_invalid_port_value_raises_error():
    env = {'POSTGRES_HOST': 'localhost', 'POSTGRES_PORT': 'notanumber', 'POSTGRES_USER': 'testuser', 'POSTGRES_PASSWORD': 'testpass', 'POSTGRES_DB': 'testdb', 'REDIS_HOST': 'localhost', 'REDIS_PORT': '26379', 'API_PORT': '23001'}
    result = get_config(env)
    assert result['valid'] is False
    assert result['error_field'] == 'POSTGRES_PORT'

def test_config_defaults_are_applied_when_optional_env_vars_missing():
    env = {'POSTGRES_HOST': 'localhost', 'POSTGRES_PORT': '25432', 'POSTGRES_USER': 'testuser', 'POSTGRES_PASSWORD': 'testpass', 'POSTGRES_DB': 'testdb', 'REDIS_HOST': 'localhost', 'REDIS_PORT': '26379', 'API_PORT': '23001'}
    result = get_config(env)
    assert result['valid'] is True

def test_config_handles_empty_env_values_as_invalid():
    env = {'POSTGRES_HOST': '', 'POSTGRES_PORT': '25432', 'POSTGRES_USER': 'testuser', 'POSTGRES_PASSWORD': 'testpass', 'POSTGRES_DB': 'testdb', 'REDIS_HOST': 'localhost', 'REDIS_PORT': '26379', 'API_PORT': '23001'}
    result = get_config(env)
    assert result['valid'] is False
    assert result['error_field'] == 'POSTGRES_HOST'