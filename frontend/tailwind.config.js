/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Colours come from the CSS variables declared in src/app/globals.css.
      // `<alpha-value>` keeps the opacity modifiers working (bg-primary/50).
      // Only the semantic + domain layers are exposed to Tailwind — primitives
      // are deliberately not, so components can't reach past the semantic layer.
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        surface: {
          DEFAULT: "hsl(var(--surface) / <alpha-value>)",
          raised: "hsl(var(--surface-raised) / <alpha-value>)",
          sunken: "hsl(var(--surface-sunken) / <alpha-value>)",
        },
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        "muted-fg": "hsl(var(--muted-fg) / <alpha-value>)",
        "subtle-fg": "hsl(var(--subtle-fg) / <alpha-value>)",

        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          hover: "hsl(var(--primary-hover) / <alpha-value>)",
          fg: "hsl(var(--primary-fg) / <alpha-value>)",
          subtle: "hsl(var(--primary-subtle) / <alpha-value>)",
        },

        border: {
          DEFAULT: "hsl(var(--border) / <alpha-value>)",
          strong: "hsl(var(--border-strong) / <alpha-value>)",
        },
        ring: "hsl(var(--ring) / <alpha-value>)",

        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          subtle: "hsl(var(--destructive-subtle) / <alpha-value>)",
          fg: "hsl(var(--destructive-fg) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "hsl(var(--warning) / <alpha-value>)",
          subtle: "hsl(var(--warning-subtle) / <alpha-value>)",
          fg: "hsl(var(--warning-fg) / <alpha-value>)",
        },
        success: {
          DEFAULT: "hsl(var(--success) / <alpha-value>)",
          subtle: "hsl(var(--success-subtle) / <alpha-value>)",
          fg: "hsl(var(--success-fg) / <alpha-value>)",
        },
        info: {
          DEFAULT: "hsl(var(--info) / <alpha-value>)",
          subtle: "hsl(var(--info-subtle) / <alpha-value>)",
          fg: "hsl(var(--info-fg) / <alpha-value>)",
        },

        // Domain: order lifecycle (matches OrderModel's `status` enum)
        status: {
          pending: "hsl(var(--status-pending) / <alpha-value>)",
          "pending-subtle": "hsl(var(--status-pending-subtle) / <alpha-value>)",
          preparing: "hsl(var(--status-preparing) / <alpha-value>)",
          "preparing-subtle": "hsl(var(--status-preparing-subtle) / <alpha-value>)",
          "on-the-way": "hsl(var(--status-on-the-way) / <alpha-value>)",
          "on-the-way-subtle": "hsl(var(--status-on-the-way-subtle) / <alpha-value>)",
          delivered: "hsl(var(--status-delivered) / <alpha-value>)",
          "delivered-subtle": "hsl(var(--status-delivered-subtle) / <alpha-value>)",
          cancelled: "hsl(var(--status-cancelled) / <alpha-value>)",
          "cancelled-subtle": "hsl(var(--status-cancelled-subtle) / <alpha-value>)",
        },

        // Domain: role accents, one per dashboard
        role: {
          admin: "hsl(var(--role-admin) / <alpha-value>)",
          "admin-subtle": "hsl(var(--role-admin-subtle) / <alpha-value>)",
          branch: "hsl(var(--role-branch) / <alpha-value>)",
          "branch-subtle": "hsl(var(--role-branch-subtle) / <alpha-value>)",
          courier: "hsl(var(--role-courier) / <alpha-value>)",
          "courier-subtle": "hsl(var(--role-courier-subtle) / <alpha-value>)",
        },
      },
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
        4.5: "18px",
        13: "3.25rem",
        "8.5": "2.13rem"
      },
      height: {
        4.5: "18px",
        13: "3.25rem",
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
      padding: {
        4.5: "18px"
      }
    },
  },
  plugins: [],
};
