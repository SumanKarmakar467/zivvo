/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
        display: ['"Playfair Display"', "serif"],
        playfair: ['"Playfair Display"', "serif"]
      },
      colors: {
        cosmic: {
          bg: "#05060F",
          surface: "#0C0F1A",
          violet: "#7C5CFC",
          violet2: "#A78BFA",
          cyan: "#22D3EE",
          rose: "#F43F5E",
          cream: "#E8EAFF",
          muted: "#7B83A8"
        },
        aura: {
          bg: "#F5F3FF",
          surface: "#EDE9FE",
          violet: "#5B21B6",
          cyan: "#0E7490",
          cream: "#1E1B4B",
          muted: "#6B7280"
        },
        accent: {
          DEFAULT: "#e8730a",
          dark: "#c45c00",
          light: "#fff3e8",
          muted: "rgba(232,115,10,0.12)"
        },
        brand: {
          bg: "#f8f5f0",
          card: "#ffffff",
          muted: "#f0ebe3",
          ink: "#1a1208",
          inkMid: "#5c4d3a",
          inkFaint: "#9c8a74"
        },
        night: {
          bg: "#0e0a06",
          card: "#1c1408",
          muted: "#241a0f",
          border: "rgba(255,255,255,0.08)"
        },
        bg: {
          warm: "#f8f5f0",
          card: "#ffffff",
          muted: "#f0ebe3"
        },
        ink: {
          DEFAULT: "#1a1208",
          muted: "#5c4d3a",
          faint: "#9c8a74"
        },
        dark: {
          bg: "#0e0a06",
          card: "#1c1408",
          muted: "#241a0f"
        },
        green: {
          DEFAULT: "#2d6a4f",
          light: "#52b788"
        },
        success: "#2d6a4f",
        successLight: "#52b788",
        zivvo: {
          surface: "#1f1a14",
          dark: {
            bg: "#19120b",
            surface: "#1f1a14",
            raised: "#2a2218"
          },
          amber: {
            brand: "#ef9f27",
            glow: "#ffb84d",
            deep: "#c97a0d"
          },
          text: {
            base: "#efe0d3",
            muted: "#c9b8a8",
            soft: "#9f8c79"
          },
          light: {
            bg: "#f5f3ef",
            surface: "#ffffff",
            border: "#e2ddd5"
          }
        }
      },
      boxShadow: {
        amber: "0 12px 28px -10px rgba(239, 159, 39, 0.45)"
      },
      backgroundImage: {
        "zivvo-radial": "radial-gradient(circle at top right, rgba(239, 159, 39, 0.22), transparent 45%)"
      }
    }
  },
  plugins: []
};
