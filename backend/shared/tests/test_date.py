import pytest
import re
from datetime import datetime

def format_to_iso(date_string: str) -> str:
    try:
        date = datetime.fromisoformat(date_string.replace('Z', '+00:00'))
        return date.isoformat()
    except ValueError:
        raise ValueError(f"Invalid date: {date_string}")

def get_days_between(start: str, end: str) -> int:
    start_date = datetime.fromisoformat(start.replace('Z', '+00:00'))
    end_date = datetime.fromisoformat(end.replace('Z', '+00:00'))
    diff = end_date - start_date
    return abs(diff.days)

def test_iso_formatting_valid_date():
    result = format_to_iso('2024-06-01T12:00:00')
    assert result == '2024-06-01T12:00:00'

def test_date_diff_returns_correct_days():
    days = get_days_between('2024-06-01', '2024-06-10')
    assert days == 9

def test_iso_formatting_invalid_input_raises_error():
    with pytest.raises(ValueError):
        format_to_iso('not-a-date')