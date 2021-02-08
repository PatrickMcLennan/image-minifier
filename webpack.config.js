const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: `./src/index.ts`,
    output: {
        path: path.resolve(__dirname, `dist`),
        filename: `[name].js`
    },
    devServer: {
        port: 3000,
        hot: true,
        contentBase: path.resolve(__dirname, `dist`)
    },
    module: {
        rules: [
            {
                test: /\.scss/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [require(`autoprefixer`)]
                            }
                        }
                    },
                    "sass-loader",
                ]
            },
            {
                test: /\.(m?js|ts)$/,
                exclude: [/(node_modules|bower_components)/],
                use:  "swc-loader"
            },
            {
                test: /\.pug/,
                use: [`pug-loader`],
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `styles.css`
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, `src/index.pug`)
        }),
    ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                'browser-image-compression': { 
                    test: /node_modules\/browser-image-compression\//, 
                    name: 'browser-image-compression', 
                    chunks: 'all' 
                },
            }
        },
        minimizer: [new CssMinimizerPlugin()],
    },
    resolve: {
        extensions: [`.js`, `.ts`]
    }
}