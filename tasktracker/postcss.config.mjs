/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},  // ✅ use the new package
    autoprefixer: {},
  },
};

export default config;
