import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from '../../src/App';

vi.mock('../../src/hooks/useDashboard', () => ({
  useDashboard: () => ({
    dashboard: null,
    loading: false,
    error: null,
    refresh: vi.fn(),
  }),
}));

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing', () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    expect(screen.getByText('Dashboard')).toBeDefined();
  });

  it('renders navigation links', () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Ordenes' })).toBeDefined();
  });

  it('renders Dashboard at root route', () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    expect(screen.getByText('Dashboard')).toBeDefined();
  });

  it('renders 404 for unknown routes', () => {
    render(<MemoryRouter initialEntries={['/nonexistent']}><App /></MemoryRouter>);
    expect(screen.getByText('404 Not Found')).toBeDefined();
  });
});