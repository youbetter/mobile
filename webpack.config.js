var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.jsx',
    exclude: /node_modules/,
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: [ 'es2015' ]
                }
            },
            {
                test: /\.jsx$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: [ 'es2015', 'react' ]
                }
            }
        ]
    },
    output: {
        path: path.join(__dirname, 'www'),
        filename: 'bundle.js',
        publicPath: ''
    },
    plugins: [
        new HtmlWebpackPlugin({
            minify: { },
            title: 'You Better',
            bodyContent: '',
            template: './src/index.html',
            inject: 'body'
        })
    ]
};
