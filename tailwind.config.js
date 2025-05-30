/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/js/**/*.{js,jsx}", // Archivos JavaScript y JSX en la carpeta resources/js
        "./resources/views/**/*.blade.php", // Archivos Blade de Laravel
        "./resources/css/**/*.css", // Archivos CSS de tu carpeta resources/css
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
