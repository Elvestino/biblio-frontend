/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#ffffff",
        span: "rgb(235, 20, 20)",
        orange: "#ff7c1f",
        blue: "#22232ac5",
      },
    },
  },
  plugins: [],
};
