// components/EmptyState.jsx
import { motion } from "framer-motion";

export default function EmptyState({ mode, search }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center px-4"
    >
      <div className="text-5xl mb-4">
        {mode === "hidden" ? "🌿" : "🧳"}
      </div>
      <h3 className="font-display text-lg text-mist-200 mb-2">
        {search ? "No places found" : "No places in this mode"}
      </h3>
      <p className="text-sm text-mist-500 max-w-xs leading-relaxed">
        {search
          ? `We couldn't find any places matching "${search}". Try a different city or keyword.`
          : mode === "hidden"
          ? "Hidden gems are rare by definition. Try a different city or remove filters."
          : "No popular places found for your filters. Try broadening your search."}
      </p>
    </motion.div>
  );
}
