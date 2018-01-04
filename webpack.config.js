
var path = require('path');
var webpack = require('webpack')
  , HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin
  , ProvidePlugin = webpack.ProvidePlugin
  ;
var ExtractTextPlugin = webpack.ExtractTextPlugin;

module.exports = {
    
    context: path.resolve(__dirname, './src'),
    entry: {
        'vertices': './vertices/core.js',
        'v': './vertices/core.js',
        'vQuery': [ './vertices/core.js', '../node_modules/jquery/dist/jquery.js', './engines/jquery.js' ],
    },
    output: {
        path: path.resolve(__dirname, 'public/build'),
        filename: '[name].js'
    },
    module: {
        rules: [
            { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
        ]
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        // new ExtractTextPlugin('bundle.css'),
        new ProvidePlugin({ '$': 'jquery', 'jQuery': 'jquery' }),
    ],
    resolve: {
        extensions: [ '.js' ]
    },
    
    devServer: {
        port: 3001,
        contentBase: path.resolve(__dirname, 'public'),
        publicPath: '/build/'
    }
    
};
