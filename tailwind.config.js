module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        '2xs': '.5rem',
      }
    },
  
  },
  variants: {
    extend: {
      borderStyle: ['active'],
      display: ["group-hover"],
      cursorNotAllowed:['disabled']
    },
    opacity: ({ after }) => after(['disabled']),
    
  },
  plugins: [],
  important: true,
}
