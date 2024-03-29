import("tailwindcss").Config;

module.exports = {
	content: [
		`components/**/*.{vue,js}`,
		`layouts/**/*.vue`,
		`pages/**/*.vue`,
		`composables/**/*.{js,ts}`,
		`plugins/**/*.{js,ts}`,
		`App.{js,ts,vue}`,
		`app.{js,ts,vue}`,
	],
	plugins: [require("@tailwindcss/typography"), require("daisyui")],
	theme: {
		screens: {
			phone: "280px",
			// => @media (min-width: 280px) { ... }
			megaphone: "412px",
			// => @media (min-width: 412px) { ... }
			tablet: "640px",
			// => @media (min-width: 640px) { ... }
			laptop: "1024px",
			// => @media (min-width: 1024px) { ... }
			desktop: "1280px",
			yj: "1700px",
			// => @media (min-width: 1280px) { ... }
		},
		container: {
			center: true,
		},
		extend: {},
		fontFamily: {
			inter: ["inter", "sans-serif"],
			poppins: ["poppins", "serif"],
			"fira-mono": ["fira-mono"],
		},
		daisyui: {
			themes: ["corporate"],
		},
	},
};
