import { describe, it, expect } from 'vitest';

describe('main.css', () => {
  it('defines CSS reset', () => {
    const css = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
    `;
    expect(css).toContain('margin');
    expect(css).toContain('padding');
  });

  it('defines body styles', () => {
    const css = `
      body {
        font-family: var(--font-family);
        background-color: var(--color-background);
        color: var(--color-text);
      }
    `;
    expect(css).toContain('font-family');
    expect(css).toContain('background-color');
  });

  it('defines root element styles', () => {
    const css = `
      #root {
        min-height: 100vh;
      }
    `;
    expect(css).toContain('#root');
    expect(css).toContain('min-height');
  });
});