import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";

export default function App() {
  // page: "home" | "explore"
  const [page, setPage]               = useState("home");
  const [initialSearch, setInitialSearch] = useState("");

  const goExplore = (query = "") => {
    setInitialSearch(query);
    setPage("explore");
  };

  const goHome = () => setPage("home");

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {page === "home" ? (
          <motion.div key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <HomePage onEnter={goExplore} />
          </motion.div>
        ) : (
          <motion.div key="explore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col"
          >
            <ExplorePage initialSearch={initialSearch} onHome={goHome} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}