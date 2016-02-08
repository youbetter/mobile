var webpack = require('webpack');
var path = require('path');
var dotenv = require('dotenv');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var production = process.env.NODE_ENV === 'production';

var loaders;
var plugins;

dotenv.config({ path: production ? 'prod.env' : 'dev.env' });

loaders = [
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
    },
    {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192'
    },
    {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap')
    },
    {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-wolf'
    },
    {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
    }
];
plugins = [
    new webpack.DefinePlugin({
        __FACEBOOK_APP_ID__: JSON.stringify(process.env.FACEBOOK_APP_ID),
        __YOUBETTER_API__: JSON.stringify(process.env.YOUBETTER_API)
    }),
    new HtmlWebpackPlugin({
        minify: { },
        title: 'You Better',
        bodyContent: '',
        template: production ? './src/index.html' : './src/index-dev.html',
        inject: 'body'
    }),
    new ExtractTextPlugin('styles.css')
];

if (production) {
    loaders.push({
        test: /\.(scss)$/,
        loader: ExtractTextPlugin.extract('css!sass')
    });
} else {
    loaders.push({
        test: /\.(scss)$/,
        loaders: [ 'style', 'css?sourceMap', 'sass?sourceMap' ]
    });
}

module.exports = {
    devtool: process.env.SOURCE_MAPS ? 'source-map' : false,
    entry: './src/index.jsx',
    exclude: /node_modules/,
    module: { loaders: loaders },
    output: {
        path: path.join(__dirname, 'www'),
        filename: 'bundle.js',
        publicPath: production ? '' :  "http://localhost:8080/"
    },
    plugins: plugins
};
