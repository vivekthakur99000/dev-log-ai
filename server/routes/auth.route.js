import express from 'express';
import { getGithubLoginUrl, githubCallback, me } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {getGithubUserRepos, getGithubRepoCommits} from "../controllers/github.controller.js"

const router = express.Router();

router.get('/github', getGithubLoginUrl);
router.get('/github/callback', githubCallback);
router.get('/me', authenticateToken, me);
router.get('/repos', authenticateToken, getGithubUserRepos);
router.get('/repos/:owner/:repo/commits', authenticateToken, getGithubRepoCommits);

export default router;
