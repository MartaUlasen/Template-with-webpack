const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = {
	entry: [
		'./src/js/main.js',
		'./src/css/main.scss'
	],
	context: path.resolve(__dirname),
	output: {
		filename: './js/bundle.js'
	},
	resolve: {
		modules: ["node_modules", path.join(__dirname, 'src/')],
		extensions: [".js", ".css", ".scss"],
	},
	devtool: "source-map",
	module: {
		rules: [
			{
			test: /\.js$/,
			include: path.resolve(__dirname, 'src/js'),
			use: {
			  loader: 'babel-loader',
			  options: {
				presets: 'env'
			  }
			}
			},
			{
			test: /\.(sass|scss)$/,
			include: path.resolve(__dirname, 'src/css'),
			use: ExtractTextPlugin.extract({
			  use: [
				{
				  loader: "css-loader",
				  options: {
					sourceMap: true,
					minimize: true,
					url: false
				  }
				},
				{
				  loader: "sass-loader",
				  options: {
					sourceMap: true
				  }
				}
			  ]
			})
			},
		]
	},
	plugins: [
		new ExtractTextPlugin({
			filename: './css/style.bundle.css',
			allChunks: true,
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'src/index.html',
			inject: true
		}),
		new HtmlWebpackPlugin({
			filename: 'index2.html',
			template: 'src/index2.html'
		}),
		new CopyWebpackPlugin([{
				from: './src/assets',
				to: './assets'
			},
			{
				from: './src/favicon.ico',
				to: './favicon.ico'
			},
			{
				from: './src/404.html',
				to: './404.html'
			} 
		]),
		new ImageminPlugin({
			disable: process.env.NODE_ENV !== 'production', // Disable during development
			pngquant: {
				quality: '95-100'
			}
		}),
		new CopyWebpackPlugin([{
			  from: 'src/assets/img/'
		}]),
		new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i })
	]
};
