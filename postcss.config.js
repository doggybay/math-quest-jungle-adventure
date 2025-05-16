module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-calc')({
      preserve: true,
    })
  ],
}