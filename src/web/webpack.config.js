var path = require('path')

var webpack = require('webpack')
var HtmlwebpackPlugin = require('html-webpack-plugin')

var ROOT_PATH = path.join(path.resolve(__dirname), '../../')

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: [
        path.resolve(ROOT_PATH, 'src/web/main'),
    ],
    module: {
        loaders: [{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'react-hot-loader/webpack'
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015'],
                    plugins: ['transform-regenerator']
                }
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: path.resolve(ROOT_PATH, 'dist'),
        publicPath: '/',
        filename: 'main.js'
    },
    devServer: {
        contentBase: path.resolve(ROOT_PATH, 'dist'),
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlwebpackPlugin({
            title: 'Poet - Bard',
            template: path.resolve(ROOT_PATH, 'meta/index.html')
        })
    ]
}