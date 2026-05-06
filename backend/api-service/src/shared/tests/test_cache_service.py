import pytest
import sqlite3
from typing import Any, Optional

class CacheService:
    def __init__(self):
        self.store = {}

    def get(self, key: str) -> Optional[Any]:
        if not isinstance(key, str):
            raise TypeError("Key must be a string")
        return self.store.get(key)

    def set(self, key: str, value: Any, ttl: int) -> None:
        if not isinstance(key, str):
            raise TypeError("Key must be a string")
        self.store[key] = value

    def del(self, key: str) -> None:
        if key in self.store:
            del self.store[key]

def test_cache_set_and_get_value():
    cache = CacheService()
    cache.set('test-key', 'test-value', 300)
    result = cache.get('test-key')
    assert result == 'test-value'

def test_cache_get_nonexistent_key_returns_none():
    cache = CacheService()
    result = cache.get('nonexistent-key')
    assert result is None

def test_cache_set_invalid_key_type_raises_error():
    cache = CacheService()
    with pytest.raises(TypeError):
        cache.set(123, 'value', 300)