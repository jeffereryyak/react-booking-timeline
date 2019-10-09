var path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader', // creates style nodes from JS strings
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS
                }],
            },
            {
                test: /\.js?$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['react', 'stage-0']
                        }
                    }
                ]
            }
        ]
    },
    externals: {
        'react': 'commonjs react'
    }
};