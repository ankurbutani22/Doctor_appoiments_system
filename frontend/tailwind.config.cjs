module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:"#5F6FFF",
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fit, minmax(250px, 1fr))',
      },
    },
  },
  plugins: [
    
  ],
}

