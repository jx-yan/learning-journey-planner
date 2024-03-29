export default defineNuxtConfig({
	modules: [
		"@nuxtjs/color-mode",
		"@nuxt/content",
		[
			"@pinia/nuxt",
			{
				autoImports: ["defineStore"],
			},
		],
		"@nuxtjs/tailwindcss",
	],
	components: {
		global: true,
		dirs: ["~/components"],
	},
	tailwindcss: {
		configPath: "~/tailwind.config.js",
		cssPath: "~/assets/css/tailwind.css",
	},
});
