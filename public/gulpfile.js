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

var mocha = require('gulp-mocha-phantomjs');
gulp.task('test', function () {
	return gulp
		.src('test/index.html')
		.pipe(mocha());
});

var mochaTest = require('gulp-mocha');
gulp.task('zombie', function() {
	process.env.PORT = 3333;
	var server = require('../server/server');
	gulp
		.src('test/_headless/*.js')
		.pipe(mochaTest())
		.once('end', process.exit);
});

gulp.task('watch', function () {
	gulp.watch('js/**/*.js', ['test']);
});