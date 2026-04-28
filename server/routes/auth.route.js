import express from 'express';
import { getGithubLoginUrl, githubCallback, me } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/github', getGithubLoginUrl);
router.get('/github/callback', githubCallback);
router.get('/me', authenticateToken, me);

export default router;
