const fs = require("fs");
const path = require("path");
const NodemonPlugin = require("nodemon-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    entry: "./server.ts",
    output: {
        path: path.join(__dirname, "../build"),
        filename: "server.js"
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    },
    target: "node",
    externals: [{ mongoose: 'commonjs mongoose', express: 'commonjs express' }],
    plugins: [new NodemonPlugin(), new webpack.ContextReplacementPlugin(/require_optional/,/mongoose/,/express/)]
};
