import express, { RequestHandler } from 'express';
import { protect as authenticateToken } from '../middleware/auth.middleware';
import {
  searchUsers,
  sendRecommendation,
  getReceivedRecommendations,
  markAsRead
} from '../controllers/recommendation.controller';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken as RequestHandler);

// Search users by email
router.get('/search-users', searchUsers as RequestHandler);

// Send a property recommendation
router.post('/send', sendRecommendation as RequestHandler);

// Get recommendations received by the user
router.get('/received', getReceivedRecommendations as RequestHandler);

// Mark recommendation as read
router.patch('/:recommendationId/read', markAsRead as RequestHandler);

export default router; 