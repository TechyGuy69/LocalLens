# 🌿 LocalLens — India's Anti-Tourist Guide

> A premium, map-first travel guide that helps you discover India's hidden gems vs. popular tourist spots — powered by Google Gemini AI.

![LocalLens](https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80)

## ✨ Features

- **🧳 Tourist Mode** — India's most iconic, highly-rated destinations
- **🌿 Hidden Gems Mode** — Quiet, local, authentic places tourists rarely find
- **🗺️ Interactive Dark Map** — Custom markers with CartoDB dark tiles
- **🤖 Gemini AI Analysis** — Crowd level, authenticity score, local tips, vibes
- **🔍 Smart Search** — Search by place name, city, state, or category
- **🏙️ City Filter** — Filter across 10+ Indian cities
- **✨ Premium UI** — Glassmorphism, Framer Motion animations, Apple Maps-inspired

## 🗂️ Project Structure

```
locallens/
├── frontend/                    # React + Vite + Tailwind
│   └── src/
│       ├── App.jsx              # Main layout
│       ├── components/
│       │   ├── Header.jsx       # Top navigation
│       │   ├── MapView.jsx      # Leaflet map with custom markers
│       │   ├── ModeToggle.jsx   # Tourist / Hidden Gems switch
│       │   ├── SearchBar.jsx    # Search + city filter
│       │   ├── PlaceCard.jsx    # Place card + skeleton
│       │   ├── PlaceDetail.jsx  # Slide-in detail panel
│       │   ├── StatsBar.jsx     # Summary stats
│       │   └── EmptyState.jsx   # Empty search results
│       ├── hooks/
│       │   └── usePlaces.js     # Data fetching hook
│       └── utils/
│           └── helpers.js       # Utility functions
│
└── backend/                     # Node.js + Express
    ├── server.js                # Entry point
    ├── data/places.json         # 20 curated Indian places
    ├── routes/places.js         # API routes
    ├── controllers/
    │   └── placesController.js  # Request handlers
    └── services/
        └── geminiService.js     # Gemini AI integration
```

## 🚀 Setup

### 1. Clone / Copy the project

```bash
cd locallens
```

### 2. Backend setup

```bash
cd backend
npm install

# Copy environment file
cp .env.example .env

# Add your Gemini API key (free at https://aistudio.google.com)
# Edit .env: GEMINI_API_KEY=your_key_here

npm run dev
```

Backend runs on **http://localhost:4000**

> **No Gemini key?** It works! Falls back to deterministic mock AI analysis.

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:3000**

## 🤖 Gemini AI Integration

The backend calls Gemini 1.5 Flash with this prompt strategy per place:

```
Given: name, city, category, rating, reviewCount, description, tags

Returns JSON:
{
  crowdLevel: "Low" | "Medium" | "High",
  authenticityScore: 1-100,        // 100 = deeply local, 0 = tourist trap
  summary: "2 vivid sentences",
  vibe: "3-4 word label",
  bestTimeToVisit: "Early morning",
  localTip: "Insider advice"
}
```

**Crowd Level logic:**
- High: `reviewCount > 20,000`
- Medium: `2,000 – 20,000`
- Low: `< 2,000`

**Authenticity Score logic:**
- Starts at 100
- Decreases with high review count (`−reviewCount/2500`)
- Increases with hidden/local/quiet/peaceful tags (`+8 per tag`)

## 🎨 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS |
| Animations | Framer Motion |
| Map | Leaflet + react-leaflet (CartoDB Dark tiles) |
| Backend | Node.js, Express |
| AI | Google Gemini 1.5 Flash |
| Fonts | Playfair Display + DM Sans + DM Mono |

## 📍 Dataset

20 carefully curated Indian places across 10 cities:
Mumbai, Delhi, Jaipur, Srinagar, Hampi, Agra, Varanasi, Munnar, Amritsar, Coorg

Each pair: 1 popular tourist spot + 1 hidden local gem.

## 🔑 API Endpoints

```
GET /api/places?mode=tourist|hidden&city=Mumbai&search=café&limit=20
GET /api/places/:id
GET /api/places/cities
GET /api/health
```

## 📝 License

MIT — Built for hackathons. Go win something. 🏆
