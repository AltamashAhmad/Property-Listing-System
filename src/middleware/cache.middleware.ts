import { Request, Response, NextFunction } from 'express';
import redisClient, { CACHE_TTL, CACHE_KEYS } from '../config/redis.config';

// Generate cache key based on request parameters
const generateCacheKey = (prefix: string, params: any): string => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc: any, key) => {
      acc[key] = params[key];
      return acc;
    }, {});
  
  return `${prefix}:${JSON.stringify(sortedParams)}`;
};

// Cache middleware for property listings
export const cachePropertyList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Generate cache key based on query parameters
    const cacheKey = generateCacheKey(CACHE_KEYS.PROPERTY_LIST, req.query);

    // Check if data exists in cache
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log('Cache hit for:', cacheKey);
      return res.json(JSON.parse(cachedData));
    }

    // If not in cache, store the original json function
    const originalJson = res.json;
    res.json = function (data) {
      // Store the response in cache before sending
      redisClient.setex(cacheKey, CACHE_TTL.PROPERTY_LIST, JSON.stringify(data))
        .catch(err => console.error('Redis cache error:', err));
      
      console.log('Cache miss, storing:', cacheKey);
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    console.error('Cache middleware error:', error);
    next(); // Proceed without caching on error
  }
};

// Cache middleware for individual property details
export const cachePropertyDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const propertyId = req.params.id;
    const cacheKey = `${CACHE_KEYS.PROPERTY_DETAIL}:${propertyId}`;

    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log('Cache hit for property:', propertyId);
      return res.json(JSON.parse(cachedData));
    }

    const originalJson = res.json;
    res.json = function (data) {
      redisClient.setex(cacheKey, CACHE_TTL.PROPERTY_DETAIL, JSON.stringify(data))
        .catch(err => console.error('Redis cache error:', err));
      
      console.log('Cache miss, storing property:', propertyId);
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    console.error('Cache middleware error:', error);
    next();
  }
};

// Cache middleware for search results
export const cacheSearchResults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = generateCacheKey(CACHE_KEYS.SEARCH_RESULTS, req.query);

    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log('Cache hit for search:', cacheKey);
      return res.json(JSON.parse(cachedData));
    }

    const originalJson = res.json;
    res.json = function (data) {
      redisClient.setex(cacheKey, CACHE_TTL.SEARCH_RESULTS, JSON.stringify(data))
        .catch(err => console.error('Redis cache error:', err));
      
      console.log('Cache miss, storing search:', cacheKey);
      return originalJson.call(this, data);
    };

    next();
  } catch (error) {
    console.error('Cache middleware error:', error);
    next();
  }
};

// Cache invalidation functions
export const invalidatePropertyCache = async (propertyId: string) => {
  try {
    // Remove specific property cache
    await redisClient.del(`${CACHE_KEYS.PROPERTY_DETAIL}:${propertyId}`);
    
    // Get all property list cache keys
    const listKeys = await redisClient.keys(`${CACHE_KEYS.PROPERTY_LIST}:*`);
    const searchKeys = await redisClient.keys(`${CACHE_KEYS.SEARCH_RESULTS}:*`);
    
    // Remove all related caches
    if (listKeys.length > 0) {
      await redisClient.del(listKeys);
    }
    if (searchKeys.length > 0) {
      await redisClient.del(searchKeys);
    }
    
    console.log('Cache invalidated for property:', propertyId);
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}; 