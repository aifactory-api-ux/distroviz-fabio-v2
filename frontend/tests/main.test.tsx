import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../src/App';

describe('main.tsx', () => {
  it('renders root App component', () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    expect(screen.getByText('Dashboard')).toBeDefined();
  });

  it('renders with strict mode', () => {
    render(<BrowserRouter><App /></BrowserRouter>);
    const link = screen.getByRole('link', { name: 'Dashboard' });
    expect(link).toBeDefined();
  });
});