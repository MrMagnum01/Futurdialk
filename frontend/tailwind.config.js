/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#137fec',
                'primary-hover': '#0f6bd0',
                secondary: '#617589',
                'bg-light': '#f6f7f8',
                'bg-dark': '#101922',
                'surface-light': '#ffffff',
                'surface-dark': '#1a2632',
                'text-main': '#111418',
                'text-sub': '#617589',
            },
            fontFamily: {
                display: ['Lexend', 'sans-serif'],
                body: ['Lexend', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
