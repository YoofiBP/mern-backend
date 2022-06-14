const path = require('path');
const CURRENT_WORKING_DIR = process.cwd();
const nodeExternals = require('webpack-node-externals');

const config = {
    name: "server",
    entry: [path.join(CURRENT_WORKING_DIR, '/server/server.ts')],
    target: "node",
    output: {
        path: path.join(CURRENT_WORKING_DIR, '/dist/'),
        filename: "server.generated.js",
        publicPath: '/dist/',
        libraryTarget: "commonjs",
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
    }
};

module.exports = config;