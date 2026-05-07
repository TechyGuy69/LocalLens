import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModeToggle from "../components/ModeToggle";
import SearchBar from "../components/SearchBar";
import PlaceCard, { CardSkeleton } from "../components/PlaceCard";
import MapView from "../components/MapView";
import PlaceDetail from "../components/PlaceDetail";
import { usePlaces } from "../hooks/usePlaces";

export default function ExplorePage({ initialSearch, onHome }) {
  const {
    places, loading, error,
    mode, setMode, search, setSearch,
    city, setCity, cities,
    selectedPlace, setSelectedPlace,
  } = usePlaces(initialSearch);

  // Esc to deselect
  useEffect(() => {
    const h = e => e.key === "Escape" && setSelectedPlace(null);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [setSelectedPlace]);

  return (
    <div className="flex flex-col w-full h-full bg-cream-100">

      {/* ── TOPBAR ── */}
      <div className="glass-heavy border-b border-white/60 px-4 sm:px-6 py-3 flex-shrink-0 flex items-center justify-between z-40 shadow-sm">
        <button onClick={onHome} className="flex items-center gap-2.5 hover:opacity-70 transition-opacity">
          <div className="w-8 h-8 rounded-xl bg-forest-500 flex items-center justify-center">
            <span className="text-sm leading-none">🌿</span>
          </div>
          <div>
            <span className="font-display font-semibold text-base text-stone-800 leading-none">
              Local<span className="text-gradient-forest">Lens</span>
            </span>
            <p className="text-[9px] text-stone-400 font-mono uppercase tracking-widest mt-0.5 hidden sm:block">Anti-Tourist Guide</p>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-50 border border-forest-100">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse" />
            <span className="text-xs text-forest-600 font-mono">Gemini AI</span>
          </div>
          <button onClick={onHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-stone-500 hover:bg-cream-200 hover:text-stone-800 transition-all duration-200"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="hidden sm:block">Home</span>
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT SIDEBAR ── */}
        <div className="w-full sm:w-80 lg:w-96 flex-shrink-0 flex flex-col border-r border-stone-200/60 bg-cream-50/80 overflow-hidden">

          {/* Controls */}
          <div className="p-3.5 space-y-2.5 border-b border-stone-200/50 flex-shrink-0 bg-white/50">
            <ModeToggle mode={mode} onChange={m => { setMode(m); setSelectedPlace(null); }} />
            <SearchBar search={search} onSearch={setSearch} city={city} onCity={setCity} cities={cities} />

            {/* Stats */}
            {!loading && places.length > 0 && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                className="flex items-center gap-3 px-1 text-xs text-stone-400 font-mono"
              >
                <span><b className="text-stone-600">{places.length}</b> places</span>
                <span>·</span>
                <span>
                  <b className="text-forest-500">
                    {places.filter(p=>(p.ai?.authenticityScore??0)>=70).length}
                  </b> hidden gems
                </span>
                <span>·</span>
                <span>
                  <b className="text-stone-600">
                    {Math.round(places.reduce((s,p)=>s+(p.ai?.authenticityScore??50),0)/Math.max(places.length,1))}
                  </b> avg auth
                </span>
              </motion.div>
            )}
          </div>

          {/* Mode banner */}
          <AnimatePresence mode="wait">
            <motion.div key={mode}
              initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
              className="flex-shrink-0 overflow-hidden"
            >
              <div className={`mx-3.5 mt-3 px-3.5 py-2.5 rounded-xl text-xs leading-relaxed border ${
                mode==="tourist"
                  ? "bg-amber-50 border-amber-100 text-amber-700"
                  : "bg-forest-50 border-forest-100 text-forest-700"
              }`}>
                {mode==="tourist"
                  ? <><b>🧳 Tourist Mode</b> — India's most iconic, highly-rated destinations.</>
                  : <><b>🌿 Hidden Gems</b> — Places locals love. Low crowds, high authenticity.</>
                }
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Cards */}
          <div className="flex-1 overflow-y-auto no-scroll p-3.5 space-y-3">

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                <p className="text-red-500 text-sm font-medium mb-1">⚠️ Couldn't load places</p>
                <p className="text-red-400 text-xs">Is the backend running on port 4000?</p>
              </div>
            )}

            {/* Skeletons */}
            {loading && Array.from({length:5}).map((_,i)=><CardSkeleton key={i} i={i}/>)}

            {/* Cards */}
            {!loading && !error && (
              <AnimatePresence mode="popLayout">
                {places.length === 0 ? (
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <span className="text-4xl mb-3">{mode==="hidden" ? "🌿" : "🧳"}</span>
                    <p className="text-stone-600 font-medium mb-1">No places found</p>
                    <p className="text-stone-400 text-sm max-w-xs leading-relaxed">
                      {search ? `Nothing matching "${search}". Try a different keyword or city.` : "No places for this filter. Try broadening your search."}
                    </p>
                  </motion.div>
                ) : (
                  places.map((p,i) => (
                    <PlaceCard key={p.id} place={p} index={i}
                      selected={selectedPlace?.id===p.id}
                      onClick={pl => setSelectedPlace(prev => prev?.id===pl.id ? null : pl)}
                    />
                  ))
                )}
              </AnimatePresence>
            )}

            <div className="h-4" />
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-stone-200/50 flex-shrink-0 bg-white/30">
            <p className="text-[10px] text-stone-400 text-center font-mono">
              Powered by Gemini AI · 20 curated Indian destinations
            </p>
          </div>
        </div>

        {/* ── MAP PANEL ── (hidden on mobile, shown on sm+) */}
        <div className="hidden sm:flex flex-1 relative p-3 overflow-hidden">
          {/* MapView fills this entire panel */}
          <div className="relative flex-1 w-full h-full">
            <MapView
              places={places}
              selected={selectedPlace}
              onSelect={p => setSelectedPlace(prev => prev?.id === p.id ? null : p)}
            />
            <AnimatePresence>
              {selectedPlace && (
                <PlaceDetail place={selectedPlace} onClose={() => setSelectedPlace(null)} />
              )}
            </AnimatePresence>
            {selectedPlace && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-card border border-stone-100 z-[1000]"
              >
                <span className="text-xs text-stone-400 font-mono">
                  Press <kbd className="bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded text-[10px] font-mono">Esc</kbd> to close
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}