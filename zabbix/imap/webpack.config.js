'use strict';

module.exports = {
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
                    "plugins": [
                        "@babel/plugin-proposal-class-properties"
                    ]
                }
            },
            {
                test: /\.css$/, loader: 'style-loader!css-loader'
            },
        ]
    },
    watch: true,

    devtool: 'source-map',
};