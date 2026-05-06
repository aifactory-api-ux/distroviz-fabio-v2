import Redis from 'ioredis';

let redisClient: Redis | null = null;

export async function getRedisClient(url?: string): Promise<Redis> {
  if (!redisClient) {
    const redisUrl = url || process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = new Redis(redisUrl, {
      retryStrategy: (times) => {
        if (times > 3) {
          return null;
        }
        return Math.min(times * 100, 3000);
      },
    });

    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }
  return redisClient;
}

export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}