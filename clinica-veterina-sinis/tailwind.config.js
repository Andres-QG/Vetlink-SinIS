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
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        secondary2: "var(--color-secondary2)",
        tertiary: "var(--color-tertiary)",
        tertiary2: "var(--color-tertiary2)",
        bgPrimary: "var(--color-bgPrimary)",
        text: "var(--color-text-base)",
        text2: "var(--color-text-details)",
      }
    }
  }
}

