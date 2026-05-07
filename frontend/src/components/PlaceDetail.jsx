import { motion } from "framer-motion";
import { getCrowdStyle, authColor, fmtCount, catEmoji } from "../utils/helpers";

export default function PlaceDetail({ place, onClose }) {
  if (!place) return null;
  const cs = getCrowdStyle(place.ai?.crowdLevel);
  const ac = authColor(place.ai?.authenticityScore ?? 50);

  return (
    <motion.div
      key={place.id}
      initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:30 }}
      transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}
      className="absolute top-0 right-0 bottom-0 w-72 sm:w-80 bg-white rounded-2xl shadow-float overflow-hidden flex flex-col z-10"
    >
      {/* Hero */}
      <div className="relative h-48 flex-shrink-0">
        <img src={place.image} alt={place.name} className="w-full h-full object-cover"
          onError={e => e.target.src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=60"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
        <button onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/35 transition-colors"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div className="absolute top-3 left-3">
          <span className="bg-white/20 backdrop-blur-sm border border-white/20 text-white text-[11px] px-2 py-1 rounded-full font-mono">
            {catEmoji(place.category)} {place.category}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="font-display text-white text-xl font-bold leading-tight">{place.name}</h2>
          <p className="text-white/65 text-xs font-mono mt-0.5">{place.city}, {place.state}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scroll p-4 space-y-3.5">

        {/* Vibe + crowd */}
        <div className="flex items-center justify-between gap-2">
          {place.ai?.vibe && <span className="text-sm text-forest-500 font-mono italic">"{place.ai.vibe}"</span>}
          {place.ai?.crowdLevel && (
            <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border flex-shrink-0 ${cs.bg} ${cs.text} ${cs.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cs.dot} animate-pulse`} />
              {place.ai.crowdLevel} crowd
            </span>
          )}
        </div>

        {/* Auth meter */}
        <div className="bg-stone-50 rounded-xl p-3.5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-stone-400 font-mono uppercase tracking-wider">Authenticity</span>
            <span className="text-2xl font-display font-bold" style={{ color: ac }}>
              {place.ai?.authenticityScore ?? "—"}<span className="text-sm text-stone-300">/100</span>
            </span>
          </div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full"
              initial={{ width:0 }} animate={{ width:`${place.ai?.authenticityScore ?? 0}%` }}
              transition={{ duration:0.9, ease:"easeOut" }}
              style={{ background:`linear-gradient(90deg,${ac}55,${ac})` }}
            />
          </div>
          <p className="text-[11px] text-stone-400">
            {(place.ai?.authenticityScore??0) >= 70 ? "Deeply local — very few tourists know this."
             : (place.ai?.authenticityScore??0) >= 45 ? "Known but not overrun yet."
             : "Popular with visitors. Go early."}
          </p>
        </div>

        {/* Summary */}
        {place.ai?.summary && (
          <div>
            <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wider mb-1.5">About</p>
            <p className="text-sm text-stone-600 leading-relaxed">{place.ai.summary}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-stone-50 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <svg width="12" height="12" fill="#f59e0b" viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span className="font-mono font-semibold text-stone-700">{place.rating}</span>
            </div>
            <p className="text-[10px] text-stone-400">Rating</p>
          </div>
          <div className="bg-stone-50 rounded-xl p-3 text-center">
            <p className="font-mono font-semibold text-stone-700 mb-0.5">{fmtCount(place.reviewCount)}</p>
            <p className="text-[10px] text-stone-400">Reviews</p>
          </div>
        </div>

        {/* Best time */}
        {place.ai?.bestTimeToVisit && (
          <div className="flex items-center gap-3 bg-forest-50 rounded-xl p-3 border border-forest-100">
            <div className="w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" fill="none" stroke="#2D6A4F" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <p className="text-[10px] text-forest-600 font-mono uppercase tracking-wider">Best Time</p>
              <p className="text-xs text-forest-700 font-medium mt-0.5">{place.ai.bestTimeToVisit}</p>
            </div>
          </div>
        )}

        {/* Local tip */}
        {place.ai?.localTip && (
          <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-100">
            <p className="text-[10px] text-amber-600 font-mono uppercase tracking-wider mb-1.5">💡 Local Tip</p>
            <p className="text-xs text-amber-800 leading-relaxed italic">{place.ai.localTip}</p>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {place.tags.map(t => (
            <span key={t} className="text-[10px] font-mono px-2 py-1 rounded-full bg-stone-100 text-stone-400">#{t}</span>
          ))}
        </div>

        {/* Full description */}
        <div className="border-t border-stone-100 pt-3">
          <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wider mb-1.5">Full Description</p>
          <p className="text-xs text-stone-500 leading-relaxed">{place.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
