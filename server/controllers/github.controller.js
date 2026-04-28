import { getUserRepos, getRepoCommits } from '../services/githubData.service.js';
import User from '../models/user.model.js';

export const getGithubUserRepos = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in the request object after authentication
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const token = user.accessToken;

    if (!token) {
        return res.status(400).json({ message: 'GitHub access token not found for user' });
    }

    const repos = await getUserRepos(token);


    return res.status(200).json({success : true, data : repos });
  } catch (error) {
    console.error("Error in getGithubUserRepos:", error);
    return res.status(500).json({ message: "Failed to get GitHub user repositories" });
  }
};

export const getGithubRepoCommits = async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const userId = req.user.id; // Assuming user ID is available in the request object after authentication
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = user.accessToken;

        if (!token) {
            return res.status(400).json({ message: 'GitHub access token not found for user' });
        }

        const commits = await getRepoCommits(token, owner, repo);

        return res.status(200).json({ success: true, data: commits });
    } catch (error) {
        console.error("Error in getGithubRepoCommits:", error);
        return res.status(500).json({ message: "Failed to get GitHub repository commits" });
    }
};