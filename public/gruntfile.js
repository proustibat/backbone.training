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
		},
		mocha: {
			test: {
				src: [ 'test/index.html' ],
				options: { reporter: 'Spec', run: false, log: true, logErrors: true }
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-mocha');

	grunt.registerTask('default', ['requirejs']);
	grunt.registerTask('test', ['mocha']);
};