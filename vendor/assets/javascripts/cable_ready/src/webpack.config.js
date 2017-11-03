module.exports = {
  target: 'web',
  entry: './index.js',
  plugins: [
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }
    ],
  },
  output: {
    filename: '../../cable_ready.js',
    library: ['CableReady']
  }
};
