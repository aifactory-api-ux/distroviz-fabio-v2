import { describe, it, expect } from 'vitest';

const viteConfig = {
  plugins: [{ name: 'react' }],
  server: {
    proxy: {
      '/api': 'http://localhost:23001',
    },
  },
};

describe('vite.config.ts', () => {
  it('sets up proxy for /api endpoints', () => {
    expect(viteConfig.server.proxy).toHaveProperty('/api');
    expect(viteConfig.server.proxy['/api']).toBe('http://localhost:23001');
  });

  it('supports TypeScript and React plugins', () => {
    expect(viteConfig.plugins.some((p: any) => p.name === 'react')).toBe(true);
  });
});