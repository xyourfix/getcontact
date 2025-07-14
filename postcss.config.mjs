import tailwindCssPlugin from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    tailwindCssPlugin(),
    autoprefixer(),
  ],
}