const GITHUB_AUTH_BASE = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';

const getGithubClientId = () =>
	process.env.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENTID || process.env['Client ID'];

const getGithubClientSecret = () =>
	process.env.GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENTSECRET || process.env['Client Secret'];

export const getGithubAuthUrl = (state = '') => {
	const clientId = getGithubClientId();
	const redirectUri = process.env.GITHUB_REDIRECT_URI;

	if (!clientId) {
		throw new Error('Missing GitHub client ID configuration');
	}

	const params = new URLSearchParams({
		client_id: clientId,
		scope: 'read:user user:email repo',
	});

	if (redirectUri) {
		params.set('redirect_uri', redirectUri);
	}

	if (state) {
		params.set('state', state);
	}

	return `${GITHUB_AUTH_BASE}?${params.toString()}`;
};

export const exchangeCodeForToken = async (code) => {
	const clientId = getGithubClientId();
	const clientSecret = getGithubClientSecret();

	if (!clientId || !clientSecret) {
		throw new Error('Missing GitHub OAuth credentials');
	}

	const response = await fetch(GITHUB_TOKEN_URL, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'User-Agent': 'dev-log-ai',
		},
		body: JSON.stringify({
			client_id: clientId,
			client_secret: clientSecret,
			code,
			redirect_uri: process.env.GITHUB_REDIRECT_URI,
		}),
	});

	if (!response.ok) {
		throw new Error(`GitHub token exchange failed with status ${response.status}`);
	}

	const data = await response.json();

	if (data.error) {
		throw new Error(data.error_description || data.error);
	}

	if (!data.access_token) {
		throw new Error('GitHub did not return an access token');
	}

	return data.access_token;
};

export const fetchGithubProfile = async (accessToken) => {
	const response = await fetch(GITHUB_USER_URL, {
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${accessToken}`,
			'User-Agent': 'dev-log-ai',
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch GitHub profile: ${response.status}`);
	}

	return response.json();
};
