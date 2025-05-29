import { Router, RequestHandler } from 'express';
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  checkFavorite
} from '../controllers/favorite.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All favorites routes require authentication
router.use(protect as RequestHandler);

// Add/remove favorites
router.post('/:propertyId', addToFavorites as RequestHandler);
router.delete('/:propertyId', removeFromFavorites as RequestHandler);

// Get user's favorites
router.get('/', getFavorites as RequestHandler);

// Check if property is favorited
router.get('/:propertyId/check', checkFavorite as RequestHandler);

export default router; 