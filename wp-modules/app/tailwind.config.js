module.exports = {
	content: [ './js/src/**/*.{html,js}', '../components/**/*.{html,js}' ],
	theme: {
		extend: {
			colors: {
				'wp-black': '#1e1e1e',
				'wp-blue': '#007bba',
				'wp-blue-hover': '#006ba1',
				'wp-gray': '#5d7179',
			},
		},
	},
	plugins: [ require( '@tailwindcss/forms' ) ],
};
