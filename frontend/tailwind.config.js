/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1.2rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
          "3xl": "7rem"
        },
      },
      screens: {
        "3xl": "2000px"
      },
      width: {
        4.5:"18px",
        "8.5": "2.13rem"
      },
      height: {
        4.5:"18px",
        "8.5": "2.13rem"
      },
      fontSize: {
        "super-xs": "0.815rem",
        "super-sm": "0.925rem",
        "super-base": "1.07rem",
        "1.5xl": "1.38rem",
        "2.5xl": "1.65rem",
        "3.5xl": "2.05rem",
        "4.5xl": "2.65rem",
        "5.5xl": "3.3rem"
      },
      borderRadius: {
        "2.5xl": "1.25rem",
        "4xl": "2rem",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
      },
      padding:{
        4.5:"18px"
      }
    },
  },
  plugins: [],
};
