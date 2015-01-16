module.exports = function(grunt) {

	grunt.initConfig({
		requirejs: {
			compile: {
				options: {
					baseUrl: "./js", 
					mainConfigFile: "js/app.js",
					name: "app",
					out: "dist/app.js",
					optimize: "uglify2",
					generateSourceMaps: true,
					preserveLicenseComments: false
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.registerTask('default', ['requirejs']);
};