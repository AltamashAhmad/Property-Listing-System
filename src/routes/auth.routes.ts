import { Router, Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

// Debug middleware
router.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Auth Route:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers
  });
  next();
});

// Test route
router.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Auth routes are working' });
});

router.post('/register', register as RequestHandler);
router.post('/login', login as RequestHandler);

export default router; 