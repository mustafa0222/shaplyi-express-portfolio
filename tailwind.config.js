/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx,html}"
    ],
    theme: {
        extend: {
            colors: {
                primary: "#000000", // Dark/Black background
                accent: "#5E269B", // Deep vibrant Purple
                "accent-hover": "#4a1e7a",
                text: "#FFFFFF",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'hero-pattern': "url('/images/hero-bg.jpg')", // Placeholder if needed, but we might use a solid color or gradient as per request if no image provided, but user asked for "large, compelling image or background video". I'll use a placeholder or search for one.
            }
        },
    },
    plugins: [],
}
