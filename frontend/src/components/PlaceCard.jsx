import { motion } from "framer-motion";
import { getCrowdStyle, authColor, fmtCount, catEmoji } from "../utils/helpers";

export default function PlaceCard({ place, index, selected, onClick }) {
  const { name, city, state, category, rating, reviewCount, image, ai } = place;
  const cs   = getCrowdStyle(ai?.crowdLevel);
  const ac   = authColor(ai?.authenticityScore ?? 50);

  return (
    <motion.div
      layout
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, y:-10, scale:0.97 }}
      transition={{ delay: index * 0.04, duration: 0.45, ease:[0.22,1,0.36,1] }}
      whileHover={{ y:-3, transition:{ duration:0.25 } }}
      whileTap={{ scale:0.98 }}
      onClick={() => onClick(place)}
      className={`cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 bg-white ${
        selected
          ? "ring-2 ring-forest-400 shadow-[0_0_0_2px_#52B788,0_12px_40px_rgba(82,183,136,0.18)]"
          : "shadow-card hover:shadow-card-hover"
      }`}
    >
      {/* Image */}
      <div className="relative h-40 sm:h-44 overflow-hidden">
        <img src={image} alt={name} loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={e => e.target.src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=60"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Category */}
        <div className="absolute top-2.5 left-2.5">
          <span className="bg-white/90 backdrop-blur-sm text-stone-600 text-[11px] px-2 py-1 rounded-full font-mono flex items-center gap-1">
            {catEmoji(category)} <span className="capitalize">{category}</span>
          </span>
        </div>

        {/* Authenticity */}
        <div className="absolute top-2.5 right-2.5">
          <span className="bg-white/90 backdrop-blur-sm text-[11px] px-2 py-1 rounded-full font-mono font-medium" style={{ color: ac }}>
            {ai?.authenticityScore ?? "—"} auth
          </span>
        </div>

        {/* Name over image */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5">
          <h3 className="font-display text-white text-lg font-semibold leading-tight">{name}</h3>
          <p className="text-white/65 text-xs font-mono mt-0.5">{city}, {state}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5 space-y-2.5">
        {/* Vibe + Crowd */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-forest-500 font-mono italic truncate">{ai?.vibe && `"${ai.vibe}"`}</span>
          {ai?.crowdLevel && (
            <span className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border flex-shrink-0 ${cs.bg} ${cs.text} ${cs.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cs.dot}`} />
              {ai.crowdLevel} crowd
            </span>
          )}
        </div>

        {/* Summary */}
        {ai?.summary && (
          <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">{ai.summary}</p>
        )}

        {/* Auth bar */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider">Authenticity</span>
            <span className="text-[10px] font-mono font-medium" style={{ color: ac }}>{ai?.authenticityScore ?? "—"}/100</span>
          </div>
          <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full"
              initial={{ width:0 }}
              animate={{ width:`${ai?.authenticityScore ?? 0}%` }}
              transition={{ delay: index*0.04+0.3, duration:0.8, ease:"easeOut" }}
              style={{ background:`linear-gradient(90deg,${ac}66,${ac})` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 pt-0.5 border-t border-stone-100">
          <div className="flex items-center gap-1">
            <svg width="11" height="11" fill="#f59e0b" viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span className="text-xs font-mono text-stone-700">{rating}</span>
          </div>
          <span className="text-xs text-stone-400">{fmtCount(reviewCount)} reviews</span>
          {ai?.bestTimeToVisit && (
            <span className="ml-auto text-[10px] text-stone-400 flex items-center gap-1">
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {ai.bestTimeToVisit.split(" ").slice(0,2).join(" ")}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function CardSkeleton({ i }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i*0.05 }}
      className="rounded-2xl overflow-hidden bg-white shadow-card"
    >
      <div className="h-44 shimmer-box" />
      <div className="p-3.5 space-y-2.5">
        <div className="flex gap-2">
          <div className="h-3 w-24 shimmer-box rounded-full" />
          <div className="h-3 w-16 shimmer-box rounded-full ml-auto" />
        </div>
        <div className="h-2.5 shimmer-box rounded-full" />
        <div className="h-2.5 w-4/5 shimmer-box rounded-full" />
        <div className="h-1 shimmer-box rounded-full" />
      </div>
    </motion.div>
  );
}
