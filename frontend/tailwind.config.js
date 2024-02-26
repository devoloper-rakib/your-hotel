/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {},
		container: {
			padding: '5rem', // if there is any container related problem i have to change this to 10rem
		},
	},
	plugins: [],
};
