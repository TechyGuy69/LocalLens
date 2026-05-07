import { useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import { authColor, catEmoji } from "../utils/helpers";

delete L.Icon.Default.prototype._getIconUrl;

function makeIcon(place, selected) {
  const emoji  = catEmoji(place.category);
  const hidden = (place.ai?.authenticityScore ?? 0) > 65;
  const color  = hidden ? "#2D6A4F" : "#C4862A";
  const s      = selected ? 54 : 44;

  const svg = `<svg width="${s}" height="${s + 12}" viewBox="0 0 54 66" xmlns="http://www.w3.org/2000/svg">
    <filter id="sh${place.id}" x="-40%" y="-20%" width="180%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="${selected ? 5 : 3}" flood-color="${color}" flood-opacity="0.35"/>
    </filter>
    <path d="M27 2C16 2 7 11 7 22c0 15 20 40 20 40s20-25 20-40C47 11 38 2 27 2z"
      fill="${color}" stroke="white" stroke-width="${selected ? 2.5 : 2}" filter="url(#sh${place.id})"/>
    <circle cx="27" cy="22" r="13" fill="white" opacity="0.96"/>
    <text x="27" y="27.5" text-anchor="middle" font-size="14" font-family="serif">${emoji}</text>
    ${selected ? `<circle cx="27" cy="22" r="20" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.45"/>` : ""}
  </svg>`;

  return L.divIcon({
    className: "",
    html: svg,
    iconSize:   [s, s + 12],
    iconAnchor: [s / 2, s + 12],
    popupAnchor:[0, -(s + 12)],
  });
}

// Fly to selected place
function FlyTo({ place }) {
  const map = useMap();
  const prevId = useRef(null);
  useEffect(() => {
    if (place && place.id !== prevId.current) {
      prevId.current = place.id;
      map.flyTo([place.location.lat, place.location.lng], 13, { animate: true, duration: 1.0 });
    }
  }, [place, map]);
  return null;
}

// Fit map to show ALL markers whenever places list changes
function FitBounds({ places }) {
  const map     = useMap();
  const prevKey = useRef("");

  useEffect(() => {
    if (!places || places.length === 0) return;
    // Build a key from all ids — re-fit whenever the set changes
    const key = places.map(p => p.id).join(",");
    if (key === prevKey.current) return;
    prevKey.current = key;

    const coords = places.map(p => [p.location.lat, p.location.lng]);
    const bounds = L.latLngBounds(coords);
    // Small delay so the map container is fully rendered
    setTimeout(() => {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 10, animate: true });
    }, 120);
  }, [places, map]);

  return null;
}

export default function MapView({ places, selected, onSelect }) {
  return (
    // IMPORTANT: position:relative so the legend/count divs anchor inside the map box
    <motion.div
      className="relative w-full h-full rounded-2xl overflow-hidden shadow-card"
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Legend — anchored inside map via position:absolute on the relative parent */}
      <div className="absolute top-4 right-4 z-[999] bg-white/92 backdrop-blur-md rounded-xl px-3 py-2.5 shadow-card space-y-1.5 border border-stone-100 pointer-events-none">
        <p className="text-[9px] text-stone-400 font-mono uppercase tracking-widest mb-1.5">Legend</p>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#2D6A4F" }} />
          <span className="text-[11px] text-stone-500">Hidden Gems</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#C4862A" }} />
          <span className="text-[11px] text-stone-500">Tourist Spots</span>
        </div>
      </div>

      {/* Place count */}
      <div className="absolute bottom-5 right-4 z-[999] bg-white/92 backdrop-blur-md rounded-full px-3 py-1.5 shadow-card border border-stone-100 pointer-events-none">
        <span className="text-xs font-mono font-medium" style={{ color: "#2D6A4F" }}>{places.length}</span>
        <span className="text-xs font-mono text-stone-400"> places on map</span>
      </div>

      <MapContainer
        center={[22.5, 80.5]}
        zoom={5}
        style={{ width: "100%", height: "100%" }}
        zoomControl
        scrollWheelZoom
        attributionControl
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OSM</a> &copy; <a href="https://carto.com">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        <FitBounds places={places} />
        <FlyTo place={selected} />

        {places.map(place => (
          <Marker
            key={place.id}
            position={[place.location.lat, place.location.lng]}
            icon={makeIcon(place, selected?.id === place.id)}
            zIndexOffset={selected?.id === place.id ? 1000 : 0}
            eventHandlers={{ click: () => onSelect(place) }}
          >
            <Popup maxWidth={240} minWidth={210} closeButton>
              <div>
                <img
                  src={place.image} alt={place.name}
                  className="w-full h-28 object-cover"
                  onError={e => { e.target.style.display = "none"; }}
                />
                <div className="p-3.5 space-y-2">
                  <div>
                    <h3 className="font-semibold text-stone-800 text-sm leading-tight">{place.name}</h3>
                    <p className="text-stone-400 text-xs mt-0.5 font-mono">{place.city}, {place.state}</p>
                  </div>
                  {place.ai?.summary && (
                    <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                      {place.ai.summary.split(".")[0]}.
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-1.5 border-t border-stone-100">
                    <span className="text-xs font-mono font-medium" style={{ color: authColor(place.ai?.authenticityScore ?? 50) }}>
                      {place.ai?.authenticityScore ?? "—"} auth
                    </span>
                    {place.ai?.crowdLevel && (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        place.ai.crowdLevel === "Low"    ? "bg-green-50 text-green-600" :
                        place.ai.crowdLevel === "Medium" ? "bg-amber-50 text-amber-600" :
                                                           "bg-red-50 text-red-500"
                      }`}>
                        {place.ai.crowdLevel} crowd
                      </span>
                    )}
                  </div>
                  {place.ai?.localTip && (
                    <p className="text-[11px] text-stone-400 italic border-t border-stone-100 pt-2 leading-relaxed">
                      💡 {place.ai.localTip}
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </motion.div>
  );
}