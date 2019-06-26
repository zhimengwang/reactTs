const path = require('path');
var webpack = require('webpack');


const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const tsImportPluginFactory = require('ts-import-plugin')

const isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production';
const sourcePath = path.join(__dirname, './src');

const postcssOption = {
    ident: 'postcss',
    plugins: [
        require('postcss-import')({addDependencyTo: webpack}),
        require('postcss-url')(),
        require('postcss-preset-env')({
            /* use stage 2 features (defaults) */
            stage: 2
        }),
        require('postcss-reporter')(),
        require('postcss-browser-reporter')({
            disabled: isProduction
        })
    ]
};

module.exports = {
    entry: './src/index.tsx',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.min.js'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                options: {
                    getCustomTransformers: () => ({
                        before: [ tsImportPluginFactory( { style: true}) ]
                    }),
                },
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            sourceMap: !isProduction,
                            importLoaders: 1,
                            localIdentName: isProduction ? '[hash:base64:5]' : '[local]__[hash:base64:5]'
                        }

                    }, // translates CSS into CommonJS
                    "sass-loader", // compiles Sass to CSS, using Node Sass by default
                    {
                        loader: 'postcss-loader',
                        options: postcssOption
                    }
                ]
            },
            {
                test: /\.css$/,
                exclude: [
                    path.resolve(__dirname, "node_modules"),
                ],
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                        query: {
                            modules: true,
                            sourceMap: !isProduction,
                            importLoaders: 1,
                            localIdentName: isProduction ? '[hash:base64:5]' : '[local]__[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: postcssOption
                    }
                ],
            },
            {test: /\.(a?png|svg)$/, use: 'url-loader?limit=10000'},
            {
                test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/,
                use: 'file-loader'
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: !isProduction
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2,
                            localsConvention: "camelCase",
                            modules: {
                                localIdentName: "[path][name]__[local]--[hash:base64:5]"
                            }
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: postcssOption
                    },
                    {
                        loader: "less-loader",
                        options: {
                            javascriptEnabled: true,
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                exclude: /src/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: postcssOption
                    },
                    {
                        loader: "less-loader",
                        options: {
                            javascriptEnabled: true,
                        }
                    }
                ]
            },
        ]
    },

    optimization: {
        splitChunks: {
            name: true,
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    minChunks: 2
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    filename: isProduction ? 'vendor.[contenthash].js' : 'vendor.[hash].js',
                    priority: -10
                }
            }
        },
        runtimeChunk: true
    },
    devServer: {
        contentBase: sourcePath,
        hot: true,
        inline: true,
        historyApiFallback: {
            disableDotRule: true
        },
        stats: 'minimal',
        clientLogLevel: 'warning'
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development', // 除非有定义 process.env.NODE_ENV，否则就使用 'development'
            DEBUG: false
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[hash].css',
            disable: !isProduction
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
};
