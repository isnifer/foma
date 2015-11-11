var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        demo: "./demo/jsx/demo.jsx",
        complex: "./demo/jsx/complex.jsx"
    },
    output: {
        path: path.join(__dirname, 'demo', 'js'),
        filename: "[name].js"
    },
    module: {
        loaders: [
            {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel'}
        ]
    }
};
