/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "dark-primary": "#212121",
        "dark-secondary": "#595959",
        "dark-grayish": "#383838",
        "light-text": "#717172",
        color1: "var(--color1)",
        color2: "var(--color2)",
        color3: "var(--color3)",
        color4: "var(--color4)",
        color5: "var(--color5)",
        color6: "var(--color6)",
        color7: "var(--color7)",
        color8: "var(--color8)",
        color9: "var(--color9)",
      },
    },
  },
  plugins: [],
};
