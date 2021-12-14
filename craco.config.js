module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    configure: (config) => {
      config.module.rules.push({
        test: /\.js$/,
        use: { loader: require.resolve('@open-wc/webpack-import-meta-loader') }
      });
      return config
    }
  }
}