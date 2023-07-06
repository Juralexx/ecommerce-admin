/** @type {import('tailwindcss').Config} */
module.exports = {
    experimental: {
        optimizeUniversalDefaults: true
    },
    corePlugins: {
        preflight: false,
    },
    content: [
        './src/**/**/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        screens: {
            'xs': { 'max': '576px' },
            'sm': { 'max': '768px' },
            'md': { 'max': '992px' },
            'lg': { 'max': '1200px' },
            'xl': { 'max': '1440px' },
            'min-xs': { 'min': '576px' },
            'min-sm': { 'min': '769px' },
            'min-md': { 'min': '993px' },
            'min-lg': { 'min': '1201px' },
            'min-xl': { 'min': '1441px' },
            'xs-to-sm': { 'min': '577px', 'max': '768px' },
            'xs-to-md': { 'min': '577px', 'max': '992px' },
            'xs-to-lg': { 'min': '577px', 'max': '1200px' },
            'xs-to-xl': { 'min': '577px', 'max': '1440px' },
            'sm-to-md': { 'min': '769px', 'max': '992px' },
            'sm-to-lg': { 'min': '769px', 'max': '1200px' },
            'sm-to-xl': { 'min': '769px', 'max': '1440px' },
            'md-to-lg': { 'min': '993px', 'max': '1200px' },
            'md-to-xl': { 'min': '993px', 'max': '1440px' },
            'lg-to-xl': { 'min': '1201px', 'max': '1440px' },
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
