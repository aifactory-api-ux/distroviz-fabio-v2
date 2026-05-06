import { describe, it, expect } from 'vitest';

const tsconfig = {
  compilerOptions: {
    strict: true,
    paths: {
      '@/*': ['src/*'],
    },
    target: 'ESNext',
  },
};

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
});