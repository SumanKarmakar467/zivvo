/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        zivvo: {
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
