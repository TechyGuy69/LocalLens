// components/StatsBar.jsx
import { motion } from "framer-motion";

export default function StatsBar({ places, mode }) {
  const hiddenCount = places.filter((p) => (p.ai?.authenticityScore ?? 0) >= 70).length;
  const avgAuth = places.length
    ? Math.round(places.reduce((s, p) => s + (p.ai?.authenticityScore ?? 50), 0) / places.length)
    : 0;
  const lowCrowdCount = places.filter((p) => p.ai?.crowdLevel === "Low").length;

  const stats = [
    { label: "Places Found", value: places.length, suffix: "", color: "text-mist-100" },
    { label: "Hidden Gems", value: hiddenCount, suffix: "", color: "text-jade-400" },
    { label: "Avg Authenticity", value: avgAuth, suffix: "/100", color: "text-amber-400" },
    { label: "Low Crowd", value: lowCrowdCount, suffix: "", color: "text-jade-400" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="flex items-center gap-4 px-1"
    >
      {stats.map((s, i) => (
        <div key={s.label} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-ink-700 text-xs">•</span>}
          <span className={`text-sm font-mono font-medium ${s.color}`}>
            {s.value}
            {s.suffix}
          </span>
          <span className="text-xs text-mist-600 hidden sm:block">{s.label}</span>
        </div>
      ))}
    </motion.div>
  );
}
