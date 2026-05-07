import { useState, useEffect, useCallback, useRef } from "react";

export function usePlaces(initialSearch = "") {
  const [places, setPlaces]           = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [mode, setMode]               = useState("tourist");
  const [search, setSearch]           = useState(initialSearch);
  const [city, setCity]               = useState("all");
  const [cities, setCities]           = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const debounce = useRef(null);

  useEffect(() => {
    fetch("/api/places/cities").then(r=>r.json()).then(d=>d.success && setCities(d.cities)).catch(()=>{});
  }, []);

  const fetch_ = useCallback(async (m, s, c) => {
    setLoading(true); setError(null);
    try {
      const p = new URLSearchParams({ mode: m, limit: 20 });
      if (s) p.set("search", s);
      if (c && c !== "all") p.set("city", c);
      const res = await fetch(`/api/places?${p}`);
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setPlaces(data.places || []);
    } catch(e) { setError(e.message); setPlaces([]); }
    finally    { setLoading(false); }
  }, []);

  useEffect(() => { fetch_(mode, search, city); }, [mode, city]);
  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => fetch_(mode, search, city), 380);
    return () => clearTimeout(debounce.current);
  }, [search]);

  return { places, loading, error, mode, setMode, search, setSearch, city, setCity, cities, selectedPlace, setSelectedPlace };
}
