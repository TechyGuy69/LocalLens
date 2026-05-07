import { useRef } from "react";

export default function SearchBar({ search, onSearch, city, onCity, cities }) {
  const ref = useRef(null);
  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-350">
          <svg width="15" height="15" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <input ref={ref} type="text" value={search} onChange={e => onSearch(e.target.value)}
          placeholder="Search places, cities, vibes…"
          className="w-full glass rounded-xl pl-9 pr-4 py-2.5 text-sm text-stone-700 placeholder-stone-350 focus:outline-none focus:ring-2 focus:ring-forest-400/30 transition-all duration-200 shadow-card"
          style={{ caretColor:"#52B788" }}
        />
      </div>
      <div className="relative">
        <select value={city} onChange={e => onCity(e.target.value)}
          className="glass rounded-xl px-3 py-2.5 pr-7 text-sm text-stone-600 focus:outline-none appearance-none cursor-pointer shadow-card min-w-[110px] transition-all duration-200"
        >
          <option value="all">All Cities</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
