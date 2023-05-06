/** @type {import('tailwindcss').Config} */
module.exports = {
    experimental: {
        optimizeUniversalDefaults: true
    },
    corePlugins: {
        preflight: false,
    },
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        screens: {
            'xl': { 'max': '1440px' },
            'lg': { 'max': '1200px' },
            'md': { 'max': '992px' },
            'sm': { 'max': '768px' },
            'xs': { 'max': '576px' },
            'min-xl': { 'min': '1441px' },
            'min-lg': { 'min': '1201px' },
            'min-md': { 'min': '993px' },
            'min-sm': { 'min': '769px' },
            'min-xs': { 'min': '576px' },
            'xs-to-sm': { 'min': '577px', 'max': '768px' },
            'xs-to-md': { 'min': '577px', 'max': '992px' },
            'xs-to-lg': { 'min': '577px', 'max': '1200px' },
            'xs-to-xl': { 'min': '577px', 'max': '1440px' },
            'sm-to-md': { 'min': '768px', 'max': '992px' },
            'sm-to-lg': { 'min': '768px', 'max': '1200px' },
            'sm-to-xl': { 'min': '768px', 'max': '1440px' },
            'md-to-lg': { 'min': '992px', 'max': '1200px' },
            'md-to-xl': { 'min': '992px', 'max': '1440px' },
            'lg-to-xl': { 'min': '1200px', 'max': '1440px' },
        }
    },
    blocklist: [
        'blur',
        'backdrop-filter',
        'filter',
        'grayscale',
        'container',
        'transition'
    ],
    plugins: [],
}
