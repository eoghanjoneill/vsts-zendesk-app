/* eslint-env node */
const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractStyles = new ExtractTextPlugin("main.css");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const externalAssets = require("./lib/javascripts/external_assets");

module.exports = {
  entry: {
    app: [
      "babel-polyfill",
      "./src/javascripts/index.js",
      "./src/stylesheets/app.scss"
    ],
    modal: [
      "babel-polyfill",
      "./src/javascripts/modal.js",
      "./src/stylesheets/app.scss"
    ]
  },
  output: {
    path: path.resolve(__dirname, "./dist/assets"),
    filename: "[name].js",
    sourceMapFilename: "[file].map"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: "pre",
        loader: "eslint-loader"
      },
      {
        test: /\.(gif|jpe?g|png|svg|woff2?|ttf|eot)$/,
        loader: "url-loader?limit=10000&name=[name].[ext]"
      },
      {
        test: /\.scss$/,
        use: extractStyles.extract({
          fallback: "style-loader",
          use: [
            "css-loader?sourceMap&root=" +
              path.resolve(__dirname, "./dist/assets"),
            "sass-loader?sourceMap"
          ]
        })
      },
      {
        test: /\.json$/,
        include: path.resolve(__dirname, "./src/translations"),
        loader: "translations-loader",
        options: {
          runtime: "handlebars"
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(handlebars|hd?bs)$/,
        loader: "handlebars-loader",
        options: {
          extensions: ["handlebars", "hdbs", "hbs"],
          runtime: "handlebars",
          inlineRequires: "/images/"
        }
      }
    ]
  },
  resolveLoader: {
    modules: ["node_modules", path.resolve(__dirname, "./lib/loaders")]
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "./lib/javascripts")],
    alias: {
      app_manifest: path.resolve(__dirname, "./dist/manifest.json")
    }
  },
  externals: {
    handlebars: "Handlebars",
    jquery: "jQuery",
    lodash: "_",
    moment: "moment",
    zendesk_app_framework_sdk: "ZAFClient"
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 4567 
  },
  devtool: "source-map",
  plugins: [
    extractStyles,
    new HtmlWebpackPlugin({
      warning:
        "AUTOMATICALLY GENERATED FROM ./lib/templates/layout.hdbs - DO NOT MODIFY THIS FILE DIRECTLY",
      vendorCss: externalAssets.css,
      vendorJs: externalAssets.js,
      template: "!!handlebars-loader!./lib/templates/layout.hdbs",
      chunks: ["app"],
      filename: "index.html"
    }),
    new HtmlWebpackPlugin({
      warning:
        "AUTOMATICALLY GENERATED FROM ./lib/templates/modal.hdbs - DO NOT MODIFY THIS FILE DIRECTLY",
      vendorCss: externalAssets.css,
      vendorJs: externalAssets.js,
      template: "!!handlebars-loader!./lib/templates/modal.hdbs",
      filename: "modal.html",
      chunks: ["modal"]
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_debugger: false,
        warnings: false
      }
    })
  ]
};
