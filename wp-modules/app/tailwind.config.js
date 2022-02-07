module.exports = {
	content: ["./includes/js/src/**/*.{html,js}"],
	theme: {
	  extend: {
        colors: {
          'wp-black':'#1E1E1E',
		  'wp-blue':'#007BBA',
		  'wp-blue-hover':'#006ba1',
		  'wp-blue-hover':'#006ba1',
		  'wp-gray':'#687B81'
        }
      },
	},
	plugins: [
		require('@tailwindcss/forms'),
	],
};