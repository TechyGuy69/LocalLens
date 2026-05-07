// services/geminiService.js
// Handles all Gemini API interactions for LocalLens

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze a place and generate crowd level, authenticity score, and summary.
 *
 * Example prompt strategy:
 * We pass the place's name, description, rating, review count, and tags.
 * Gemini returns a structured JSON with:
 *   - crowdLevel: "Low" | "Medium" | "High"
 *   - authenticityScore: 1-100
 *   - summary: short punchy 2-sentence travel-writer summary
 *   - vibe: e.g. "Serene & Local", "Buzzing Tourist Hub"
 */
export async function analyzePlaceWithGemini(place) {
  // If no API key, return graceful mock data
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
    return generateMockAnalysis(place);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a travel intelligence engine for LocalLens, an "anti-tourist" travel guide for India.

Analyze the following place and return ONLY a valid JSON object. No markdown, no explanation, just raw JSON.

Place Details:
- Name: ${place.name}
- City: ${place.city}, ${place.state}
- Category: ${place.category}
- Rating: ${place.rating}/5
- Number of Reviews: ${place.reviewCount}
- Description: "${place.description}"
- Tags: ${place.tags.join(", ")}

Return this exact JSON structure:
{
  "crowdLevel": "Low" | "Medium" | "High",
  "authenticityScore": <integer 1-100>,
  "summary": "<2 punchy, vivid sentences a travel writer would write. No clichés.>",
  "vibe": "<3-4 word vibe label, e.g. 'Serene Local Escape' or 'Iconic Tourist Hub'>",
  "bestTimeToVisit": "<short phrase, e.g. 'Early morning' or 'Winter months'>",
  "localTip": "<one insider tip locals would know>"
}

Rules:
- crowdLevel is "High" if reviewCount > 20000, "Medium" if 2000-20000, "Low" if < 2000
- authenticityScore: 100 = deeply local/hidden, 0 = pure tourist trap. Base this on tags, review count, and description.
- summary must be sharp, vivid, journalistic. Avoid "nestled", "stunning", "beautiful".
- localTip must be something a local resident would actually say, not what a guidebook says.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip any accidental markdown code fences
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error(`Gemini error for ${place.name}:`, error.message);
    // Fallback to deterministic mock if API fails
    return generateMockAnalysis(place);
  }
}

/**
 * Deterministic fallback analysis when Gemini is unavailable.
 * Uses the same logic rules as the Gemini prompt.
 */
function generateMockAnalysis(place) {
  const { reviewCount, tags, description, name } = place;

  // Crowd level based on review count
  let crowdLevel;
  if (reviewCount > 20000) crowdLevel = "High";
  else if (reviewCount >= 2000) crowdLevel = "Medium";
  else crowdLevel = "Low";

  // Authenticity score — lower review count + hidden/local tags = higher score
  const hiddenKeywords = ["hidden", "local", "quiet", "peaceful", "offbeat", "authentic", "serene", "underrated"];
  const hiddenTagCount = tags.filter((t) => hiddenKeywords.includes(t)).length;
  let authenticityScore = Math.round(
    100 - Math.min(reviewCount / 2500, 50) + hiddenTagCount * 8
  );
  authenticityScore = Math.max(10, Math.min(98, authenticityScore));

  // Vibe label
  const isHidden = hiddenTagCount >= 2;
  const isIconic = tags.includes("iconic") || tags.includes("must-visit");
  let vibe;
  if (isIconic && reviewCount > 50000) vibe = "Iconic Heritage Site";
  else if (isHidden && crowdLevel === "Low") vibe = "Serene Local Escape";
  else if (crowdLevel === "High") vibe = "Buzzing Tourist Hub";
  else vibe = "Quietly Discovered";

  // Summary — use first two sentences of description
  const sentences = description.split(/(?<=[.!?])\s+/);
  const summary = sentences.slice(0, 2).join(" ");

  const tips = [
    "Visit on a weekday morning for a completely different experience.",
    "Ask the chai vendor near the entrance — they know everything.",
    "The back entrance is always quieter than the main gate.",
    "Come fasting — eating here first thing feels right.",
    "Bring cash. Cards rarely work near here.",
  ];

  const bestTimes = [
    "Early morning (6-8am)",
    "Late afternoon (4-6pm)",
    "Winter months (Nov-Feb)",
    "Monsoon season for lush scenery",
    "Weekday mornings",
  ];

  return {
    crowdLevel,
    authenticityScore,
    summary,
    vibe,
    bestTimeToVisit: bestTimes[Math.floor(name.length % bestTimes.length)],
    localTip: tips[Math.floor(reviewCount % tips.length)],
  };
}
