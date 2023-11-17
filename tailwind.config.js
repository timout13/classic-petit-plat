/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*.{html,js}"],
  theme: {
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
      main: ["Anton", "sans-serif"],
      body: ["Manrope", "sans-serif"],
    },
    extend: {
      colors: {
        warning: "#F8D36F",
        bg: "#EDEDED",
        grey: "#EDEDED",
      },
      backgroundImage: {
        "hero-pattern": "url('/assets/img/hero_bg.png')",
        "footer-texture": "url('/img/footer-texture.png')",
      },
      padding: {
        container: "69px",
        btn: "69px",
      },
      height: {
        article: "731px", 
      }
    },
  },
  plugins: [],
};