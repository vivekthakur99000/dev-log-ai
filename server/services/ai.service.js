const GEMINI_DEFAULT_MODEL = "gemini-2.5-flash";
const ALLOWED_SUMMARY_TYPES = ["standup", "pr", "weekly"];
const GEMINI_MAX_ATTEMPTS = 3;
const GEMINI_RETRYABLE_STATUS_CODES = new Set([429, 503]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getGeminiStatusCode = (error) => {
  const statusCandidates = [
    error?.status,
    error?.code,
    error?.response?.status,
    error?.cause?.status,
  ];

  const numericStatus = statusCandidates.find(
    (value) => Number.isInteger(value) || (typeof value === "string" && /^\d+$/.test(value)),
  );

  return Number(numericStatus);
};

const isRetryableGeminiError = (error) => {
  const statusCode = getGeminiStatusCode(error);

  if (GEMINI_RETRYABLE_STATUS_CODES.has(statusCode)) {
    return true;
  }

  const message = String(error?.message || "");
  return message.includes("429") || message.includes("503");
};

const generateGeminiSummary = async (prompt, apiKey, model) => {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey });

  let lastError;

  for (let attempt = 1; attempt <= GEMINI_MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      });

      const summary = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!summary) {
        throw new Error("Gemini response did not contain a summary");
      }

      return String(summary).trim();
    } catch (error) {
      lastError = error;

      if (!isRetryableGeminiError(error) || attempt === GEMINI_MAX_ATTEMPTS) {
        throw error;
      }

      const delayMs = 1000 * attempt;
      console.warn(
        `Gemini request failed with ${getGeminiStatusCode(error) || "unknown status"}. ` +
          `Retrying in ${delayMs}ms (${attempt}/${GEMINI_MAX_ATTEMPTS})`,
      );
      await sleep(delayMs);
    }
  }

  throw lastError;
};

const buildPromptByType = (type, formattedCommits) => {
  const promptByType = {
    standup: `You are a senior software engineer writing a daily standup update.

Your task is to convert the following commit messages into a clear, concise, and professional standup update.

Instructions:
- Write in natural language (not bullet points)
- Group related work together
- Avoid repeating similar commits
- Focus on what was achieved, not technical noise
- Keep it short (3–5 sentences max)
- Ensure the response is complete and not cut off mid-sentence

Commit messages:
${formattedCommits}`,
    pr: `You are a senior software engineer preparing a pull request description.

Your task is to generate a complete and well-structured PR summary from the following commit messages.

Instructions:
- Start with a short summary paragraph (2–3 sentences) explaining the purpose of the changes
- Then provide 4–6 concise bullet points describing key updates
- Group related changes logically
- Highlight important improvements such as performance, refactoring, or testing
- Keep language clear, professional, and reviewer-friendly
- Do NOT leave the response incomplete or cut off mid-sentence

Commit messages:
${formattedCommits}`,
    weekly: `You are a senior software engineer writing a weekly development report.

Your task is to summarize the following commit messages into a structured weekly update.

Instructions:
- Start with a short paragraph summarizing overall progress
- Then organize work into 2–4 bullet groups based on themes (e.g., features, fixes, improvements)
- Highlight impact and outcomes, not just tasks
- Mention quality improvements like testing, refactoring, or performance
- Keep it concise but informative
- Ensure the response is complete and not cut off mid-sentence

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

    const geminiKey = process.env.GEMINI_API_KEY;
    const geminiModelEnv = process.env.GEMINI_MODEL || GEMINI_DEFAULT_MODEL;

    if (!geminiKey) {
      throw new Error("GEMINI_API_KEY is required to generate AI summaries");
    }

    try {
      return await generateGeminiSummary(prompt, geminiKey, geminiModelEnv);
    } catch (clientErr) {
      console.error("Gemini SDK request failed:", clientErr);
      throw new Error("Failed to fetch AI commits summary");
    }
  } catch (error) {
    console.error("Error fetching AI commits summary:", error);
    throw new Error("Failed to fetch AI commits summary");
  }
};
