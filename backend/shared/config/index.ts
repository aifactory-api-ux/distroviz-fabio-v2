import { Module } from '@nestjs/common';

export interface Config {
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  API_PORT: number;
}

export function loadConfig(env: Record<string, string | undefined>): Config {
  const required = ['POSTGRES_HOST', 'POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_DB', 'REDIS_HOST', 'REDIS_PORT', 'API_PORT'];
  for (const key of required) {
    if (!env[key]) {
      throw new Error(`Missing required env var: ${key}`);
    }
  }

  const port = parseInt(env.POSTGRES_PORT!, 10);
  if (isNaN(port) || port <= 0) {
    throw new Error(`Invalid POSTGRES_PORT: ${env.POSTGRES_PORT}`);
  }

  return {
    POSTGRES_HOST: env.POSTGRES_HOST!,
    POSTGRES_PORT: port,
    POSTGRES_USER: env.POSTGRES_USER!,
    POSTGRES_PASSWORD: env.POSTGRES_PASSWORD!,
    POSTGRES_DB: env.POSTGRES_DB!,
    REDIS_HOST: env.REDIS_HOST!,
    REDIS_PORT: parseInt(env.REDIS_PORT!, 10),
    API_PORT: parseInt(env.API_PORT!, 10),
  };
}