/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,html}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#EA5B0C",
                "primary-hover": "#F4965B",
                "secondary": "#591C0B",
                "secondary-light": "#8C4F3E",
                "background-light": "#FFFBF7",
                "background-dark": "#221610",
                "surface": "#FFFFFF",
            },
            fontFamily: {
                "display": ["Fraunces", "Manrope", "serif"],
                "body": ["Manrope", "sans-serif"],
                "mono": ["Chivo Mono", "monospace"],
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "full": "9999px"
            },
            boxShadow: {
                "warm": "0 10px 30px -10px rgba(234, 91, 12, 0.15)",
                "warm-hover": "0 20px 40px -12px rgba(234, 91, 12, 0.25)",
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                'fade-in': 'fadeIn 0.4s ease-out forwards',
                'subtle-pulse': 'subtlePulse 2s infinite',
                'fill-up': 'fillUp 8s ease-in-out forwards',
                'fade-in-out': 'fadeInOut 4s ease-in-out infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                subtlePulse: {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(234, 91, 12, 0.4)' },
                    '50%': { boxShadow: '0 0 0 10px rgba(234, 91, 12, 0)' },
                },
                fillUp: {
                    '0%': { height: '0%' },
                    '100%': { height: '100%' },
                },
                fadeInOut: {
                    '0%, 100%': { opacity: '0.4' },
                    '50%': { opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}