import { describe, it, expect } from 'vitest';
import viteConfig from '../vite.config';

describe('vite.config.ts', () => {
  it('sets up proxy for /api endpoints', () => {
    expect(viteConfig.server).toBeDefined();
    expect(viteConfig.server.proxy).toHaveProperty('/api');
  });

  it('supports TypeScript and React plugins', () => {
    expect(viteConfig.plugins).toBeDefined();
    expect(viteConfig.plugins.some((p: any) => p.name === 'vite-plugin-react')).toBe(true);
  });

  it('has resolve alias configured', () => {
    expect(viteConfig.resolve).toBeDefined();
    expect(viteConfig.resolve.alias).toHaveProperty('@');
  });

  it('has test configuration for jsdom', () => {
    expect(viteConfig.test).toBeDefined();
    expect(viteConfig.test.environment).toBe('jsdom');
  });
});