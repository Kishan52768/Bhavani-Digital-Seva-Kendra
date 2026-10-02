/** @type {import('tailwindcss').Config} */
module.exports = {
    // `overline` is a Tailwind utility; without this an app's own eyebrow-label class draws a line above the text.
    blocklist: ["overline"],
    darkMode: ["class"],
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    "1": "hsl(var(--chart-1))",
                    "2": "hsl(var(--chart-2))",
                    "3": "hsl(var(--chart-3))",
                    "4": "hsl(var(--chart-4))",
                    "5": "hsl(var(--chart-5))",
                },
                ink: {
                    DEFAULT: "#08090C",
                    surface: "#10131B",
                    elevated: "#171B26",
                },
                saffron: {
                    DEFAULT: "#FF9933",
                    soft: "#FFB866",
                },
                leaf: "#2EA84F",
                ashoka: "#0A2540",
                cyanhl: "#00B4D8",
                whatsapp: "#25D366",
            },
            fontFamily: {
                display: ["Outfit", "sans-serif"],
                body: ['"Plus Jakarta Sans"', "sans-serif"],
                mono: ['"JetBrains Mono"', "monospace"],
                serif: ["Fraunces", "serif"],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                marquee: {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-50%)" },
                },
                "pulse-ring": {
                    "0%": { transform: "scale(1)", opacity: "0.6" },
                    "100%": { transform: "scale(1.9)", opacity: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                marquee: "marquee 48s linear infinite",
                "spin-slow": "spin 40s linear infinite",
                "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.16,1,0.3,1) infinite",
            },
            boxShadow: {
                saffron: "0 0 40px rgba(255,153,51,0.25)",
                card: "0 20px 50px -20px rgba(0,0,0,0.6)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
