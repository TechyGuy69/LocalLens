import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SLIDES = [
  { url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1800&q=85", city: "Amber Fort", state: "Rajasthan" },
  { url: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1800&q=85",    city: "Taj Mahal",  state: "Agra" },
  { url: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1800&q=85", city: "Dal Lake",   state: "Srinagar" },
  { url: "https://images.unsplash.com/photo-1561361058-c24e02b64abb?w=1800&q=85",    city: "Varanasi Ghats", state: "UP" },
  { url: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=1800&q=85", city: "Hampi Ruins", state: "Karnataka" },
];

const PLACEHOLDERS = [
  "Hidden cafés in Mumbai…",
  "Peaceful ghats in Varanasi…",
  "Local gems near Jaipur…",
  "Secret spots in Srinagar…",
  "Quiet trails in Munnar…",
];

const CHIPS = ["Mumbai cafés", "Hidden Hampi", "Varanasi ghats", "Jaipur gems", "Munnar trails"];

export default function HomePage({ onEnter }) {
  const [slide, setSlide]       = useState(0);
  const [query, setQuery]       = useState("");
  const [phIdx, setPhIdx]       = useState(0);
  const [focused, setFocused]   = useState(false);
  const inputRef = useRef(null);

  // Cycle background
  useEffect(() => {
    const t = setInterval(() => setSlide(i => (i + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  // Cycle placeholder
  useEffect(() => {
    if (focused) return;
    const t = setInterval(() => setPhIdx(i => (i + 1) % PLACEHOLDERS.length), 3000);
    return () => clearInterval(t);
  }, [focused]);

  const go = (q = query) => onEnter(q.trim());

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-stone-900">

      {/* ── BACKGROUND SLIDESHOW ── */}
      <AnimatePresence mode="wait">
        <motion.div key={slide}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img src={SLIDES[slide].url} alt="" className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>

      {/* Gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent" />

      {/* ── TOP NAV ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 sm:px-8 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <span className="text-sm">🌿</span>
          </div>
          <span className="font-display text-white font-semibold text-lg tracking-tight">LocalLens</span>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse-dot" />
          <span className="text-white/80 text-xs font-mono tracking-wide">Gemini AI</span>
        </div>
      </div>

      {/* ── HERO CONTENT ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-5 sm:px-8 text-center">

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs font-mono tracking-widest uppercase">
            <span>🇮🇳</span> India's Anti-Tourist Guide
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-white leading-[0.92] tracking-tight mb-4 sm:mb-6"
        >
          <span className="block text-[clamp(3rem,10vw,7rem)] font-bold">See India</span>
          <span className="block text-[clamp(2.8rem,9.5vw,6.5rem)] font-light italic text-cream-300">differently.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, duration: 0.7 }}
          className="text-white/55 text-sm sm:text-base md:text-lg max-w-md mb-8 sm:mb-10 leading-relaxed font-light"
        >
          Skip the tour buses. Find the places locals actually love —
          from hidden cafés to sacred spots tourists never reach.
        </motion.p>

        {/* ── SEARCH BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.56, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-xl"
        >
          <div
            className="flex items-center rounded-2xl sm:rounded-full overflow-hidden shadow-float"
            style={{ background: focused ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.93)" ,
                     boxShadow: focused ? "0 0 0 3px rgba(82,183,136,0.35), 0 20px 60px rgba(0,0,0,0.2)" : "0 20px 60px rgba(0,0,0,0.18)",
                     transition: "all 0.25s" }}
          >
            <div className="pl-5 pr-3 text-stone-350 flex-shrink-0">
              <svg width="19" height="19" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>

            <input ref={inputRef} type="text" value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={e => e.key === "Enter" && go()}
              placeholder={PLACEHOLDERS[phIdx]}
              className="flex-1 py-4 sm:py-[18px] text-sm sm:text-base text-stone-800 placeholder-stone-400 bg-transparent focus:outline-none"
              style={{ caretColor: "#52B788" }}
            />

            <AnimatePresence>
              {query && (
                <motion.button type="button"
                  initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.7 }}
                  onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                  className="px-1.5 text-stone-300 hover:text-stone-500 transition-colors"
                >
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>

            <button onClick={() => go()}
              className="m-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl sm:rounded-full bg-forest-500 hover:bg-forest-600 active:scale-95 text-white text-sm font-medium transition-all duration-200 flex-shrink-0 flex items-center gap-2 shadow-sm"
            >
              <span className="hidden sm:block">Explore</span>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>

          {/* Chips */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.85, duration:0.5 }}
            className="flex flex-wrap justify-center gap-2 mt-3.5"
          >
            {CHIPS.map(c => (
              <button key={c} onClick={() => go(c)}
                className="px-3.5 py-1.5 rounded-full text-xs text-white/75 border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/22 hover:text-white transition-all duration-200"
              >
                {c}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.0, duration:0.6 }}
          className="flex items-center gap-8 sm:gap-12 mt-10 sm:mt-12"
        >
          {[["20+","Places"], ["10","Cities"], ["AI","Powered"]].map(([v,l], i) => (
            <div key={l} className="flex items-center gap-8 sm:gap-12">
              {i > 0 && <div className="w-px h-7 bg-white/15" />}
              <div className="text-center">
                <p className="font-display text-2xl sm:text-3xl font-bold text-white">{v}</p>
                <p className="text-white/45 text-xs tracking-wide mt-0.5">{l}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Browse All — below stats, inline */}
        <motion.button onClick={() => go("")}
          initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.25, duration:0.5 }}
          className="mt-8 flex flex-col items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase">Browse All Places</span>
          <motion.div animate={{ y:[0,5,0] }} transition={{ repeat:Infinity, duration:1.6 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </motion.div>
        </motion.button>
      </div>

      {/* ── BOTTOM: slide label + dots ── */}
      <div className="absolute bottom-6 sm:bottom-8 left-5 sm:left-8 z-20">
        <AnimatePresence mode="wait">
          <motion.p key={slide}
            initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
            transition={{ duration: 0.4 }}
            className="text-white/50 text-[11px] font-mono tracking-widest uppercase flex items-center gap-2"
          >
            <span className="w-1 h-1 rounded-full bg-white/40" />
            {SLIDES[slide].city} — {SLIDES[slide].state}
          </motion.p>
        </AnimatePresence>
        <div className="flex gap-1.5 mt-2.5">
          {SLIDES.map((_,i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`h-[3px] rounded-full transition-all duration-500 ${i===slide ? "w-7 bg-white" : "w-2.5 bg-white/25"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}