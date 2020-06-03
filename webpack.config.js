const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const fs = require('fs');

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: true,
    })
  })
}

const htmlPlugins = generateHtmlPlugins('./src/html/views');

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
				presets: 'env',
				plugins: ["transform-class-properties"]
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
			{
				test: /\.html$/,
				include: path.resolve(__dirname, 'src/html/includes'),
				use: ['raw-loader']
			}
		]
	},
	plugins: [
		new ExtractTextPlugin({
			filename: './css/style.bundle.css',
			allChunks: true,
		}),
		new CopyWebpackPlugin([{
				from: './src/assets',
				to: './assets'
			},
		]),
		new ImageminPlugin({
			disable: process.env.NODE_ENV !== 'production', // Disable during development
			test: /\.(jpe?g|png|gif|svg)$/i ,
			pngquant: {
				quality: '95-100'
			}
		}),
		new CopyWebpackPlugin([{
			from: 'src/assets/img/',
			to:  'src/assets/img/'
		}]),
	].concat(htmlPlugins)
};
