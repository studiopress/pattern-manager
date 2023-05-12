const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
  	...defaultConfig,
	entry: {
		index: path.resolve( __dirname, 'js/src', 'index.ts' ),
	},
	output: {
		filename: '[name].js',
		path: path.resolve( __dirname, 'js/build' ),
	},
};
