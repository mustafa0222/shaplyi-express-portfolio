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
                primary: "#ffffff", // Light/White background
                accent: "#7c3aed", // Bright Purple
                "accent-hover": "#6d28d9",
                text: "#1e293b", // Slate 900
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
