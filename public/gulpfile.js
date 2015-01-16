var gulp = require("gulp");
var rjs = require('gulp-requirejs');

gulp.task("default", function() {
	rjs({
		baseUrl: "./js", 
		mainConfigFile: "js/app.js",
		name: "app",
		out: "app.js",
		optimize: "uglify2",
		generateSourceMaps: true,
		preserveLicenseComments: false
	})
	.pipe(gulp.dest("dist"));
});