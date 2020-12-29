const path = require('path');

module.exports = [{
    mode: 'development',
    entry: './src/client/main.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },
    output: {
        filename: 'main.bundle.js',
        path: path.resolve(__dirname, 'public/javascripts')
    },
    resolve: {
        extensions: [
            '.ts', '.js'
        ]
    }
},
{
    mode: 'development',
    entry: './src/client/login.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },
    output: {
        filename: 'login.bundle.js',
        path: path.resolve(__dirname, 'public/javascripts')
    },
    resolve: {
        extensions: [
            '.ts', '.js'
        ]
    }
}];