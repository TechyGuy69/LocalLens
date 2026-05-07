// components/Header.jsx — compact explore page header
import { motion } from "framer-motion";

export default function Header({ onHome }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-strong border-b border-white/60 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 z-40"
    >
      {/* Logo */}
      <button
        onClick={onHome}
        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 rounded-xl bg-forest-500 flex items-center justify-center shadow-sm">
          <span className="text-sm">🌿</span>
        </div>
        <div>
          <span className="font-display font-semibold text-base text-stone-900 leading-none">
            Local<span className="text-gradient-forest">Lens</span>
          </span>
          <p className="text-[9px] text-stone-400 font-mono uppercase tracking-widest mt-0.5 hidden sm:block">
            Anti-Tourist Guide
          </p>
        </div>
      </button>

      {/* Right */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-50 border border-forest-100">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse" />
          <span className="text-xs text-forest-600 font-mono">Gemini AI</span>
        </div>
        <button
          onClick={onHome}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-stone-500 hover:text-stone-800 hover:bg-cream-200 transition-all duration-200"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="hidden sm:block">Home</span>
        </button>
      </div>
    </motion.header>
  );
}