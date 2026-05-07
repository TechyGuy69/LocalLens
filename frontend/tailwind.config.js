/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        body:    ["'Outfit'", "system-ui", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        cream:  { 50:"#FEFCF8", 100:"#F5F0E8", 200:"#EDE4D3", 300:"#E0D4BC", 400:"#C8AD8F" },
        forest: { 50:"#F0F7F4", 100:"#D4EDE4", 400:"#52B788", 500:"#2D6A4F", 600:"#1B4332" },
        spice:  { 400:"#E07A3A", 500:"#C4622A" },
        sand:   { 400:"#D4A853", 500:"#B8872A" },
      },
      animation: {
        "fade-up":   "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-in":   "fadeIn 0.5s ease forwards",
        shimmer:     "shimmer 1.8s infinite",
        float:       "float 5s ease-in-out infinite",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:   { from:{ opacity:0, transform:"translateY(24px)" }, to:{ opacity:1, transform:"translateY(0)" } },
        fadeIn:   { from:{ opacity:0 }, to:{ opacity:1 } },
        shimmer:  { "0%":{ backgroundPosition:"-200% 0" }, "100%":{ backgroundPosition:"200% 0" } },
        float:    { "0%,100%":{ transform:"translateY(0)" }, "50%":{ transform:"translateY(-10px)" } },
        pulseDot: { "0%,100%":{ opacity:1, transform:"scale(1)" }, "50%":{ opacity:0.5, transform:"scale(0.8)" } },
      },
    },
  },
  plugins: [],
};
