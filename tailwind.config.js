/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", surface: "var(--surface)", "surface-alt": "var(--surface-alt)",
        accent: "var(--accent)", "accent-soft": "var(--accent-soft)", text: "var(--text)",
        muted: "var(--muted)", border: "var(--border)", overlay: "var(--overlay)",
      },
      fontFamily: {
        heading: ["var(--font-unbounded)", "Unbounded", "Syne", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      fontSize: {
        hero: ["var(--type-hero)", { lineHeight: "1.1", letterSpacing: "-0.045em" }],
        section: ["var(--type-section)", { lineHeight: "1.1", letterSpacing: "-0.045em" }],
        "card-title": ["var(--type-card-title)", { lineHeight: "1.2" }],
        body: ["var(--type-body)", { lineHeight: "1.6" }],
        caption: ["var(--type-caption)", { lineHeight: "1.4" }],
      },
      spacing: { 1: "4px", 2: "8px", 3: "12px", 4: "16px", 6: "24px", 8: "32px", 12: "48px", 16: "64px", 24: "96px", 30: "120px" },
      borderRadius: { pill: "9999px", card: "24px", image: "32px", chip: "12px" },
      maxWidth: { container: "1280px" },
      screens: {
        mobile: { max: "639px" },
        tablet: { min: "640px", max: "1023px" },
        desktop: "1024px",
      },
      transitionTimingFunction: { editorial: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
};

