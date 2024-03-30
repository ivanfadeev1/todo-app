/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        bg: "#FAFAFA",
        stroke: "#E3E4F1",
        gray: "#9495A5",
        grayLight: "#D1D2DA",
        black: "#494C6B",
        blue: "#3A7CFD",
        grayButtonHover: "#494C6B",
        dmBg: "#171823",
        dmStroke: "#393A4B",
        dmCard: "#25273D",
        dmForeground: "#C8CBE7",
        dmGray: "#767992",
        dmGrayFaded: "#4D5067",
        dmGrayButton: "#5B5E7E",
        dmGrayButtonHover: "#E3E4F1",
      },
      fontFamily: {
        sans: ["Josefin Sans", "sans-serif"],
      },
      backgroundImage: {
        bgHeaderMobile: "url('../img/bg-mobile-light.jpg')",
        bgHeaderDesktop: "url('../img/bg-desktop-light.jpg')",
        dmBgHeaderMobile: "url('../img/bg-mobile-dark.jpg')",
        dmBgHeaderDesktop: "url('../img/bg-desktop-dark.jpg')",
      },
      boxShadow: {
        card: "0 35px 50px -15px rgba(194, 195, 214, 0.5)",
        dmCard: "0 35px 50px -15px rgba(0, 0, 0, 0.5)",
      },
    },
    screens: {
      sm: "588px",
    },
  },
  plugins: [],
};
