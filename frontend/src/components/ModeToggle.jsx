import { motion } from "framer-motion";

const MODES = [
  { id:"tourist", emoji:"🧳", label:"Tourist",     sub:"Popular & iconic" },
  { id:"hidden",  emoji:"🌿", label:"Hidden Gems", sub:"Local & peaceful" },
];

export default function ModeToggle({ mode, onChange }) {
  return (
    <div className="flex items-center glass rounded-2xl p-1 gap-1 shadow-card">
      {MODES.map(m => {
        const active = mode === m.id;
        return (
          <button key={m.id} onClick={() => onChange(m.id)}
            className="relative flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl transition-all duration-200 focus:outline-none"
          >
            {active && (
              <motion.div layoutId="mode-bg"
                className={`absolute inset-0 rounded-xl ${m.id==="tourist" ? "bg-sand-400/15 border border-sand-400/30" : "bg-forest-400/15 border border-forest-400/30"}`}
                transition={{ type:"spring", stiffness:450, damping:35 }}
              />
            )}
            <span className="relative text-base">{m.emoji}</span>
            <div className="relative">
              <p className={`text-sm font-medium leading-none transition-colors ${active ? (m.id==="tourist" ? "text-sand-500" : "text-forest-500") : "text-stone-400"}`}>
                {m.label}
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5 hidden sm:block">{m.sub}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
