module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          600: '#1f2937',
          700: '#111827',
        },
        gold: '#ffd615',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system'],
        script: ['Great Vibes', 'cursive'],
      },
      backgroundImage: {
        'hero-pattern':
          "linear-gradient(to bottom right, rgba(0,0,0,0.45), rgba(0,0,0,0.25)), url('images/eglise-orthodoxe-russe-alexander-nevsky-pau.jpeg')",
      },
    },
  },
  plugins: [],
};
