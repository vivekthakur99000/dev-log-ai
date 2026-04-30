 import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { getAiCommitsSummary, getLogs, generatePR, generateWeekly, exportCopy, exportDownload, exportToNotion, exportToSlack } from '../controllers/ai.controller.js';

const router = express.Router();

router.get('/logs', authenticateToken, getLogs);
router.get('/generate/standup/:owner/:repo', authenticateToken, getAiCommitsSummary);
router.get('/generate/pr/:owner/:repo', authenticateToken, generatePR);
router.get('/generate/weekly/:owner/:repo', authenticateToken, generateWeekly);

router.post('/export/copy', authenticateToken, exportCopy);
router.post('/export/download', authenticateToken, exportDownload);
router.post('/export/notion', authenticateToken, exportToNotion);
router.post('/export/slack', authenticateToken, exportToSlack);

export default router;