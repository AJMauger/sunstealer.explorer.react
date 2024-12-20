
import * as fs from "fs"
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

fs.copyFileSync("./src/server/serverpushnotifications.js", "./dist/serverpushnotifications.js")

const config: webpack.Configuration[] = [
    {
        mode: "development",

        devtool: "inline-source-map",
      
        entry: "./src/client/index.tsx",
      
        module: {
          rules: [
            {
              test: /\.css$/i,
              use: ["style-loader", "css-loader"]
            },
            {
              test: /\.(ts|js)x?$/i,
              use: ["ts-loader"],
              exclude: /node_modules/
            }
          ]
        },
      
        output: {
          filename: "[name].bundle.js",
          publicPath: "./"
        },
      
        plugins: [
          new HtmlWebpackPlugin({
            template: "./src/client/index.html"
          }),
          new webpack.HotModuleReplacementPlugin(),
          new webpack.ProvidePlugin({
            process: "process/browser.js"
          })
        ],
      
        resolve: {
          alias: {
            browser: "process/browser" },
          extensions: [".tsx", ".ts", ".js", ".jsx"],
          fallback: { }
        },

        target: "web"
    },
    {
      mode: "development",

      devtool: "inline-source-map",

      entry: "./src/server/index.ts",

      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: ["ts-loader"],
            exclude: /node_modules/
          }
        ]
      },

      output: {
        filename: "./index.js"
      },

      resolve: {
        extensions: [".ts", ".tsx", ".js"]
      },

      target: "node"
    }
];

export default config;
