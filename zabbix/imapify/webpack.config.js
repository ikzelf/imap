'use strict';

module.exports = {
    mode: 'development',
    entry: './app',
    output: {
        filename: 'build.js',
        library: 'app',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    // presets: ['es2015']
                    'plugins': [
                        '@babel/plugin-proposal-class-properties',
                        '@babel/plugin-proposal-private-methods',
                    ]
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            outputPath: '../assets',
                            publicPath: 'imapify/assets',
                        },
                    },
                ],
            },
            {
                test: /\.css$/, loader: 'style-loader!css-loader'
            },
        ]
    },
    watch: true,

    devtool: 'source-map',
};