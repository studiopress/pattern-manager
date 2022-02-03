module.exports = {
	content: ["./includes/js/src/**/*.{html,js}"],
	theme: {
	  extend: {
        colors: {
          'wp-black':'#1E1E1E',
		  'wp-blue':'#007BBA',
		  'wp-blue-hover':'#006ba1'
        }
      },
	},
	plugins: [
		require('@tailwindcss/forms'),
	],
};