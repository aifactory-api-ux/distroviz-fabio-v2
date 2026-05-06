import { describe, it, expect } from 'vitest';
import tsconfig from '../tsconfig.json';

describe('tsconfig.json', () => {
  it('has strict mode enabled', () => {
    expect(tsconfig.compilerOptions.strict).toBe(true);
  });

  it('has paths configured for src directory', () => {
    expect(tsconfig.compilerOptions.paths).toHaveProperty('@/*');
    expect(tsconfig.compilerOptions.paths['@/*']).toEqual(['src/*']);
  });

  it('has target set to ESNext', () => {
    expect(tsconfig.compilerOptions.target).toBe('ESNext');
  });

  it('has jsx configured for react-jsx', () => {
    expect(tsconfig.compilerOptions.jsx).toBe('react-jsx');
  });

  it('has noUnusedLocals enabled', () => {
    expect(tsconfig.compilerOptions.noUnusedLocals).toBe(true);
  });
});