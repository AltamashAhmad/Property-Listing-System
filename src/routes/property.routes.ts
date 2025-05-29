import { Router, RequestHandler } from 'express';
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} from '../controllers/property.controller';
import { protect } from '../middleware/auth.middleware';
import { 
  cachePropertyList, 
  cachePropertyDetail, 
  cacheSearchResults 
} from '../middleware/cache.middleware';

const router = Router();

// Public routes with caching
router.get('/', cachePropertyList as RequestHandler, getProperties as RequestHandler);
router.get('/:id', cachePropertyDetail as RequestHandler, getPropertyById as RequestHandler);

// Protected routes
router.post('/', protect as RequestHandler, createProperty as RequestHandler);
router.put('/:id', protect as RequestHandler, updateProperty as RequestHandler);
router.delete('/:id', protect as RequestHandler, deleteProperty as RequestHandler);

export default router; 