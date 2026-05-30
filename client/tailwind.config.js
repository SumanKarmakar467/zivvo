/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        outfit: ["Outfit", "system-ui", "sans-serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
        display: ["Syne", "sans-serif"],
        body: ["Outfit", "system-ui", "sans-serif"]
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "56px", fontWeight: "800" }],
        "display-xl": ["72px", { lineHeight: "78px", fontWeight: "800" }],
        "headline-md": ["32px", { lineHeight: "40px", fontWeight: "700" }],
        "headline-lg": ["44px", { lineHeight: "52px", fontWeight: "800" }],
        "title-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "16px", fontWeight: "700", letterSpacing: "0.1em" }]
      },
      colors: {
        "cosmic-black": "#05060F",
        background: "#11131d",
        surface: "#11131d",
        "surface-dim": "#11131d",
        "surface-bright": "#373844",
        "surface-container-lowest": "#0c0e17",
        "surface-container-low": "#1a1b25",
        "surface-container": "#1e1f29",
        "surface-container-high": "#282934",
        "surface-container-highest": "#33343f",
        "glass-surface": "#1E2035",
        "on-surface": "#e2e1f0",
        "on-surface-variant": "#ccc3d8",
        "on-background": "#e2e1f0",
        "inverse-surface": "#e2e1f0",
        "inverse-on-surface": "#2f303b",
        "electric-violet": "#7C3AED",
        "neon-cyan": "#06B6D4",
        "stellar-gold": "#F59E0B",
        "muted-silver": "#888780",
        primary: "#d2bbff",
        "on-primary": "#3f008e",
        "primary-container": "#7c3aed",
        "on-primary-container": "#ede0ff",
        secondary: "#4cd7f6",
        "on-secondary": "#003640",
        "secondary-container": "#03b5d3",
        tertiary: "#ffb95f",
        "on-tertiary": "#472a00",
        error: "#ffb4ab",
        "error-container": "#93000a",
        outline: "#958da1",
        "outline-variant": "#4a4455",
        "surface-tint": "#d2bbff",
        "surface-variant": "#33343f"
      },
      spacing: {
        unit: "4px",
        "stack-sm": "8px",
        "stack-md": "24px",
        "stack-lg": "48px",
        gutter: "16px",
        "margin-mobile": "20px",
        "margin-desktop": "80px"
      },
      boxShadow: {
        violet: "0 0 34px rgba(124, 58, 237, 0.28)",
        cyan: "0 0 30px rgba(6, 182, 212, 0.24)",
        gold: "0 0 18px rgba(245, 158, 11, 0.28)"
      },
      backgroundImage: {
        "cosmic-mesh":
          "radial-gradient(circle at 15% 12%, rgba(124,58,237,0.28), transparent 34%), radial-gradient(circle at 82% 18%, rgba(6,182,212,0.18), transparent 30%), radial-gradient(circle at 50% 86%, rgba(124,58,237,0.16), transparent 36%), linear-gradient(180deg, #05060F 0%, #080A14 48%, #05060F 100%)"
      }
    }
  },
  plugins: []
};
