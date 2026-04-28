export const getUserRepos = async (accessToken) => {
  try {
    const response = await fetch(
      "https://api.github.com/user/repos?per_page=20",
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "dev-log-ai",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();
    return repos.map((repo) => ({
      id: repo.id,
      fullName: repo.full_name,
      private: repo.private,
      htmlUrl: repo.html_url,
      description: repo.description,
      fork: repo.fork,
    }));

  } catch (error) {
    console.error("Error fetching user repositories:", error);
    throw new Error("Failed to fetch user repositories");
  }
};

export const getRepoCommits = async (accessToken, owner, repo) => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "dev-log-ai",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const commits = await response.json();
    return commits.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
    }));
  } catch (error) {
    console.error("Error fetching repository commits:", error);
    throw new Error("Failed to fetch repository commits");
  }
}
