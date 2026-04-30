import { generateCommitsSummary } from '../services/ai.service.js';
import User from '../models/user.model.js';
import Log from '../models/log.model.js';
import { getRepoCommits } from '../services/githubData.service.js';

const ALLOWED_LOG_TYPES = ['standup', 'pr', 'weekly'];

const handleGenerateCommitsSummary = async (req, res, forcedType) => {
    const { owner, repo } = req.params;
    const summaryType = String(forcedType || req.query.type || 'standup').toLowerCase();

    if (!owner || !repo) {
        return res.status(400).json({ message: 'Both owner and repo are required' });
    }

    if (!ALLOWED_LOG_TYPES.includes(summaryType)) {
        return res.status(400).json({
            message: `Invalid type. Allowed values: ${ALLOWED_LOG_TYPES.join(', ')}`,
        });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const token = user.accessToken;

    if (!token) {
        return res.status(400).json({ message: 'GitHub access token not found for user' });
    }

    const commits = await getRepoCommits(token, owner, repo);
    const commitMessages = commits.map((commit) => commit?.message).filter(Boolean);
    const summary = await generateCommitsSummary(commitMessages, summaryType);

    const createdLog = await Log.create({
        user: userId,
        type: summaryType,
        repoName: repo,
        content: summary,
    });

    return res.status(200).json({ success: true, data: summary, logId: createdLog._id });
};

export const getLogs = async (req, res) => {
    try {
        const userId = req.user.id;
        const { repo, type } = req.query;

        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const requestedLimit = parseInt(req.query.limit, 10) || 10;
        const limit = Math.min(Math.max(requestedLimit, 1), 50);
        const skip = (page - 1) * limit;

        if (type && !ALLOWED_LOG_TYPES.includes(type)) {
            return res.status(400).json({
                message: `Invalid log type. Allowed values: ${ALLOWED_LOG_TYPES.join(', ')}`,
            });
        }

        const query = { user: userId };

        if (repo) {
            query.repoName = repo;
        }

        if (type) {
            query.type = type;
        }

        const [logs, total] = await Promise.all([
            Log.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Log.countDocuments(query),
        ]);

        return res.status(200).json({
            success: true,
            data: logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error in getLogs:', error);
        return res.status(500).json({ message: 'Failed to get logs' });
    }
};

export const getAiCommitsSummary = async (req, res) => {
    try {
        return await handleGenerateCommitsSummary(req, res);

    } catch (error) {
        console.error("Error in getAiCommitsSummary:", error);
        return res.status(500).json({ message: "Failed to get AI commits summary" });
    }
};

// Convenience endpoints for specific types
export const generatePR = async (req, res) => {
        try {
            return await handleGenerateCommitsSummary(req, res, 'pr');
        } catch (error) {
            console.error("Error in generatePR:", error);
            return res.status(500).json({ message: "Failed to get AI commits summary" });
        }
};

export const generateWeekly = async (req, res) => {
        try {
            return await handleGenerateCommitsSummary(req, res, 'weekly');
        } catch (error) {
            console.error("Error in generateWeekly:", error);
            return res.status(500).json({ message: "Failed to get AI commits summary" });
        }
};

// Export helpers
export const exportCopy = async (req, res) => {
    try {
        const { logId, content } = req.body;

        let text = content;
        if (logId && !text) {
            const log = await Log.findById(logId);
            if (!log) return res.status(404).json({ message: 'Log not found' });
            text = log.content;
        }

        if (!text) return res.status(400).json({ message: 'No content to copy' });

        return res.status(200).json({ success: true, content: text });
    } catch (error) {
        console.error('Error in exportCopy:', error);
        return res.status(500).json({ message: 'Failed to export (copy)' });
    }
};

export const exportDownload = async (req, res) => {
    try {
        const { logId, filename = 'summary.txt', content } = req.body;

        let text = content;
        if (logId && !text) {
            const log = await Log.findById(logId);
            if (!log) return res.status(404).json({ message: 'Log not found' });
            text = log.content;
        }

        if (!text) return res.status(400).json({ message: 'No content to download' });

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'text/plain');
        return res.send(text);
    } catch (error) {
        console.error('Error in exportDownload:', error);
        return res.status(500).json({ message: 'Failed to export (download)' });
    }
};

export const exportToNotion = async (req, res) => {
    try {
        const { logId, content, notionToken, parentPageId } = req.body;

        let text = content;
        if (logId && !text) {
            const log = await Log.findById(logId);
            if (!log) return res.status(404).json({ message: 'Log not found' });
            text = log.content;
        }

        if (!text) return res.status(400).json({ message: 'No content to send to Notion' });
        if (!notionToken || !parentPageId) return res.status(400).json({ message: 'Notion token and parentPageId are required' });

        const notionBody = {
            parent: { page_id: parentPageId },
            properties: {
                title: {
                    title: [
                        {
                            text: { content: `Log - ${new Date().toISOString()}` },
                        },
                    ],
                },
            },
            children: [
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: { text: [{ type: 'text', text: { content: text } }] },
                },
            ],
        };

        const response = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notionBody),
        });

        if (!response.ok) {
            const textErr = await response.text();
            throw new Error(`Notion API error: ${response.status} ${textErr}`);
        }

        const result = await response.json();
        return res.status(200).json({ success: true, notion: result });
    } catch (error) {
        console.error('Error in exportToNotion:', error);
        return res.status(500).json({ message: 'Failed to export to Notion' });
    }
};

export const exportToSlack = async (req, res) => {
    try {
        const { logId, content, webhookUrl } = req.body;

        let text = content;
        if (logId && !text) {
            const log = await Log.findById(logId);
            if (!log) return res.status(404).json({ message: 'Log not found' });
            text = log.content;
        }

        if (!text) return res.status(400).json({ message: 'No content to send to Slack' });
        if (!webhookUrl) return res.status(400).json({ message: 'Slack webhookUrl is required' });

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Slack webhook error: ${response.status} ${errText}`);
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error in exportToSlack:', error);
        return res.status(500).json({ message: 'Failed to export to Slack' });
    }
};