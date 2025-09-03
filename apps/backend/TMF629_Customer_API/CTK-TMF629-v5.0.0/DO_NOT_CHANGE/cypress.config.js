const { defineConfig } = require('cypress');
const config = require('./cypress/fixtures/config.json')

module.exports = defineConfig({
	e2e: {
		video: false,
		screenshotOnRunFailure: false,
		reporter: 'mochawesome',
		reporterOptions: {
			reportDir: 'cypress/reports/json',
			overwrite: false,
			json: true,
			html: false,
			reportPageTitle: 'My Test Suite',
			embeddedScreenshots: true,
			inlineAssets: true,
		},
		baseUrl: config.url,
		setupNodeEvents(on, config) {
		},
	},
});
