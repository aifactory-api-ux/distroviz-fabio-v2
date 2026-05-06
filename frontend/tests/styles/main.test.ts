import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const cssPath = path.resolve(__dirname, '../../src/styles/main.css');
const css = fs.readFileSync(cssPath, 'utf-8');

describe('main.css', () => {
  it('defines CSS reset', () => {
    expect(css).toContain('margin');
    expect(css).toContain('padding');
  });

  it('defines body styles', () => {
    expect(css).toContain('font-family');
    expect(css).toContain('background-color');
  });

  it('defines root element styles', () => {
    expect(css).toContain('#root');
    expect(css).toContain('min-height');
  });

  it('defines CSS custom properties', () => {
    expect(css).toContain('--color-primary');
    expect(css).toContain('--color-border');
  });
});