// controllers/placesController.js
// Handles place fetching, filtering, and AI enrichment logic

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { analyzePlaceWithGemini } from "../services/geminiService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load dataset once at startup
const rawPlaces = JSON.parse(
  readFileSync(join(__dirname, "../data/places.json"), "utf-8")
);

// In-memory cache for AI analysis results (avoids redundant API calls)
const analysisCache = new Map();

/**
 * GET /api/places
 * Query params:
 *   - mode: "tourist" | "hidden" (default: "tourist")
 *   - city: filter by city name (optional)
 *   - search: keyword search (optional)
 *   - limit: number of results (default: 20)
 */
export async function getPlaces(req, res) {
  try {
    const { mode = "tourist", city, search, limit = 20 } = req.query;

    let filtered = [...rawPlaces];

    // --- Mode filtering ---
    if (mode === "tourist") {
      // Tourist mode: high rating + high review count
      filtered = filtered
        .filter((p) => p.rating >= 4.4 && p.reviewCount >= 5000)
        .sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (mode === "hidden") {
      // Hidden gems: lower review count + local/quiet/hidden tags
      const hiddenKeywords = ["hidden", "local", "quiet", "peaceful", "offbeat", "authentic", "serene", "underrated", "spiritual"];
      filtered = filtered.filter((p) => {
        const hasHiddenTag = p.tags.some((t) => hiddenKeywords.includes(t));
        const isLowTraffic = p.reviewCount < 5000;
        return hasHiddenTag && isLowTraffic;
      }).sort((a, b) => a.reviewCount - b.reviewCount); // lesser known first
    }

    // --- City filter ---
    if (city && city !== "all") {
      filtered = filtered.filter(
        (p) => p.city.toLowerCase() === city.toLowerCase()
      );
    }

    // --- Keyword search ---
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    // Limit results
    filtered = filtered.slice(0, parseInt(limit));

    // --- Enrich each place with Gemini AI analysis ---
    const enriched = await Promise.all(
      filtered.map(async (place) => {
        // Check cache first
        if (analysisCache.has(place.id)) {
          return { ...place, ai: analysisCache.get(place.id) };
        }

        const ai = await analyzePlaceWithGemini(place);
        analysisCache.set(place.id, ai);
        return { ...place, ai };
      })
    );

    res.json({
      success: true,
      mode,
      count: enriched.length,
      places: enriched,
    });
  } catch (error) {
    console.error("getPlaces error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/places/:id
 * Returns a single place with full AI analysis
 */
export async function getPlaceById(req, res) {
  try {
    const place = rawPlaces.find((p) => p.id === req.params.id);
    if (!place) {
      return res.status(404).json({ success: false, error: "Place not found" });
    }

    let ai;
    if (analysisCache.has(place.id)) {
      ai = analysisCache.get(place.id);
    } else {
      ai = await analyzePlaceWithGemini(place);
      analysisCache.set(place.id, ai);
    }

    res.json({ success: true, place: { ...place, ai } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/cities
 * Returns all unique cities in the dataset
 */
export function getCities(req, res) {
  const cities = [...new Set(rawPlaces.map((p) => p.city))].sort();
  res.json({ success: true, cities });
}
