import Redis from 'ioredis';

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  PROPERTY_LIST: 60 * 5, // 5 minutes
  PROPERTY_DETAIL: 60 * 15, // 15 minutes
  SEARCH_RESULTS: 60 * 2, // 2 minutes
};

// Cache key patterns
export const CACHE_KEYS = {
  PROPERTY_LIST: 'properties:list',
  PROPERTY_DETAIL: 'property:detail',
  SEARCH_RESULTS: 'properties:search',
};

// Create Redis client
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times: number) => {
    // Retry connection every 5 seconds for 5 times
    if (times <= 5) {
      return 5000;
    }
    return null; // Stop retrying
  },
});

// Handle Redis connection events
redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (error) => {
  console.error('Redis connection error:', error);
});

export default redisClient; 