/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        bgprimary: "var(--color-bg-primary)",
        bgsecondary: "var(--color-bg-secondary)",
        primary: "var(--color-primary)",
        hoverPrimary: "#00246d",
        secondary: "var(--color-secondary)",
        action: "var(--color-action)",
        elemsec: "var(--color-elems-secondary)",
        brand: "var(--color-brand)",
        danger: "var(--color-danger)",
        warning: "var(--color-warning)",
        success: "var(--color-success)",
      },
    },
  },
};
