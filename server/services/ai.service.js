const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "mistralai/mistral-7b-instruct";
const ALLOWED_SUMMARY_TYPES = ["standup", "pr", "weekly"];

const buildPromptByType = (type, formattedCommits) => {
  const promptByType = {
    standup: `You are a senior software engineer writing a daily standup update.

Summarize the following commit messages into a concise, clear, and professional update.

Rules:
- Group related work
- Avoid repetition
- Use natural language
- Keep it under 4-5 sentences

Commit messages:
${formattedCommits}`,
    pr: `You are a senior software engineer preparing a pull request summary.

Write a clear PR-style summary from the following commit messages.

Rules:
- Start with the main purpose of the change
- Group technical details into 3-6 concise bullet points
- Mention notable refactors, tests, or performance improvements
- Keep wording review-friendly

Commit messages:
${formattedCommits}`,
    weekly: `You are a senior software engineer writing a weekly engineering update.

Summarize the following commit messages into a weekly progress report.

Rules:
- Group work by themes
- Highlight impact and outcomes
- Mention quality improvements like tests/refactors/perf work
- Keep it concise (one short paragraph plus bullets if needed)

Commit messages:
${formattedCommits}`,
  };

  return promptByType[type];
};

const formatCommits = (commits = []) =>
  commits
    .filter(Boolean)
    .map((commit) => `- ${String(commit).trim()}`)
    .join("\n");

export const generateCommitsSummary = async (commits = [], type = "standup") => {
  try {
    const normalizedType = String(type || "standup").toLowerCase();

    if (!ALLOWED_SUMMARY_TYPES.includes(normalizedType)) {
      throw new Error(
        `Invalid summary type. Allowed values: ${ALLOWED_SUMMARY_TYPES.join(", ")}`,
      );
    }

    const recentCommits = commits.filter(Boolean).slice(-15);
    const hasCommits = recentCommits.length > 0;

    if (!hasCommits) {
      return "No recent activity found to generate summary.";
    }

    const formattedCommits = formatCommits(recentCommits);
  const prompt = buildPromptByType(normalizedType, formattedCommits);

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `OpenRouter request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    const summary = data?.choices?.[0]?.message?.content;

    if (!summary) {
      throw new Error("OpenRouter response did not contain a summary");
    }

    return summary;
  } catch (error) {
    console.error("Error fetching AI commits summary:", error);
    throw new Error("Failed to fetch AI commits summary");
  }
};
