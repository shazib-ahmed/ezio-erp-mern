/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          a0: "var(--clr-primary-a0)",
          a10: "var(--clr-primary-a10)",
          a20: "var(--clr-primary-a20)",
          a30: "var(--clr-primary-a30)",
          a40: "var(--clr-primary-a40)",
          a50: "var(--clr-primary-a50)",
        },
        surface: {
          a0: "var(--clr-surface-a0)",
          a10: "var(--clr-surface-a10)",
          a20: "var(--clr-surface-a20)",
          a30: "var(--clr-surface-a30)",
          a40: "var(--clr-surface-a40)",
          a50: "var(--clr-surface-a50)",
          tonal: {
            a0: "var(--clr-surface-tonal-a0)",
            a10: "var(--clr-surface-tonal-a10)",
            a20: "var(--clr-surface-tonal-a20)",
            a30: "var(--clr-surface-tonal-a30)",
            a40: "var(--clr-surface-tonal-a40)",
            a50: "var(--clr-surface-tonal-a50)",
          },
        },
        success: {
          a0: "var(--clr-success-a0)",
          a10: "var(--clr-success-a10)",
          a20: "var(--clr-success-a20)",
        },
        warning: {
          a0: "var(--clr-warning-a0)",
          a10: "var(--clr-warning-a10)",
          a20: "var(--clr-warning-a20)",
        },
        danger: {
          a0: "var(--clr-danger-a0)",
          a10: "var(--clr-danger-a10)",
          a20: "var(--clr-danger-a20)",
        },
        info: {
          a0: "var(--clr-info-a0)",
          a10: "var(--clr-info-a10)",
          a20: "var(--clr-info-a20)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
