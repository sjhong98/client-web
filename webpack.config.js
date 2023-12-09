const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const dotenv = require('dotenv');
const webpack = require('webpack');
dotenv.config();

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname + "/build"),
    publicPath: '/',
  },
  devServer: {
    open: true,
    port: 9000,
    historyApiFallback: true
  },
  mode: "development",
  plugins: [
    new webpack.DefinePlugin({
        'process.env' : JSON.stringify(process.env)
    }),
    new HtmlWebPackPlugin({
			template: './public/index.html', 
      filename: 'index.html',
      
    }),
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
        'process.env' : JSON.stringify(process.env)
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: "/node_modules",
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              "@babel/preset-env", ["@babel/preset-react", {"runtime": "automatic"}]
            ]
          }
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(jpg|png|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }  
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, '/src'),
      "@/styles": path.resolve(__dirname, '/src/styles'),
      "@/views": path.resolve(__dirname, '/src/views'),
    }
  },
  target: "web",
  externals: {
    fs: "empty",
    child_process: "empty",
  },
};