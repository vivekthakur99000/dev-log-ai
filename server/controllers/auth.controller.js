import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import {
	exchangeCodeForToken,
	fetchGithubProfile,
	getGithubAuthUrl,
} from '../services/github.service.js';

const signAuthToken = (payload) => {
	const jwtSecret = process.env.JWT_SECRET;

	if (!jwtSecret) {
		throw new Error('Missing JWT_SECRET configuration');
	}

	return jwt.sign(payload, jwtSecret, {
		expiresIn: process.env.JWT_EXPIRES_IN || '7d',
	});
};

export const getGithubLoginUrl = (req, res) => {
	try {
		const { state } = req.query;
		const url = getGithubAuthUrl(state || '');
		return res.redirect(url);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const githubCallback = async (req, res) => {
	try {
		const { code } = req.query;

		if (!code) {
			return res.status(400).json({ message: 'GitHub authorization code is required' });
		}

		const accessToken = await exchangeCodeForToken(code);
		const githubProfile = await fetchGithubProfile(accessToken);

		if (!githubProfile?.id || !githubProfile?.login) {
			return res.status(400).json({ message: 'Invalid GitHub profile response' });
		}

		const user = await User.findOneAndUpdate(
			{ githubId: String(githubProfile.id) },
			{
				githubId: String(githubProfile.id),
				username: githubProfile.login,
				avatarUrl: githubProfile.avatar_url || null,
				accessToken,
			},
			{
				new: true,
				upsert: true,
				setDefaultsOnInsert: true,
			}
		);

		const token = signAuthToken({
			id: user._id.toString(),
			githubId: user.githubId,
			username: user.username,
		});

		return res.status(200).json({
			token,
			user: {
				id: user._id,
				githubId: user.githubId,
				username: user.username,
				avatarUrl: user.avatarUrl,
			},
		});
	} catch (error) {
		return res.status(500).json({ message: error.message || 'GitHub authentication failed' });
	}
};

export const me = async (req, res) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ message: 'Missing or invalid authorization header' });
		}

		const token = authHeader.split(' ')[1];
		const jwtSecret = process.env.JWT_SECRET;

		if (!jwtSecret) {
			return res.status(500).json({ message: 'Missing JWT_SECRET configuration' });
		}

		const decoded = jwt.verify(token, jwtSecret);
		const user = await User.findById(decoded.id).select('-accessToken');

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		return res.status(200).json({ user });
	} catch (error) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};
