/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      colors: {
        bgprimary: "var(--color-bg-primary)",
        bgsecondary: "var(--color-bg-secondary)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        action: "var(--color-action)",
        elemsec: "var(--color-elems-secondary)",
        brand: "var(--color-brand)",
        danger: "var(--color-danger)",
        warning: "var(--color-warning)",
        success: "var(--color-success)",
      }
    }
  }
}

