const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  mode: "development",
  devServer: {
    static: "./dist",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.html$/i,
        use: "html-loader",
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: '/src/index.html'
    })
  ],
  resolve: {
    extensions: [".js"],
  },
};
