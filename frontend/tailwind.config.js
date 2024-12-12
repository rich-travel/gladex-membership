/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        "screen-2xl": "1400px",
        "custom-1200": "1200px",
        "custom-900": "900px",
      },
    },
  },
  plugins: [],
};
