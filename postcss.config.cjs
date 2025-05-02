// postcss.config.cjs
module.exports = {
  plugins: [
    require('postcss-nested'),
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};