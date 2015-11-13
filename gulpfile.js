// LIBRARIES
// - - - - - - - - - - - - - - -
var $ = require('gulp-load-plugins')(),
	gulp = require('gulp'),
	rimraf = require('rimraf'),
	sequence = require('run-sequence');


// PATHS
// - - - - - - - - - - - - - - -
var paths = {
	vendorCSS: [
		'node_modules/bootstrap/dist/css/bootstrap.min.css'
	],
	sass: [
		'style/**/*.scss'
	],
	js : [
		'script/**/*.js'
	],
	pluginsJS: [
		'node_modules/angular-builds/angular.min.js',
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/angularfire/dist/angularfire.min.js',
		'node_modules/firebase/lib/firebase-web.js',
		'node_modules/bootstrap/dist/js/bootstrap.min.js',
		//'script/list-functionality.js'
	],
	files : [
		'index.html'
	]
}


// TASKS
// - - - - - - - - - - - - - - -

// Cleans the build directory
gulp.task('clean', function(cb) {
	rimraf('./build', cb);
});

// Copies the index file
gulp.task('copy', function() {
	return gulp.src(paths.files)
	.pipe(gulp.dest('./build'));
});

// Starts a test server, which you can view at http://localhost:8080
gulp.task('server', function() {
	gulp.src('./build')
	.pipe($.webserver({
		port: 8080,
		host: 'localhost',
		fallback: 'index.html',
		livereload: true,
		open: true
	}) );
});

// Copies the vendor files
gulp.task('copy-css', function() {
	return gulp.src(paths.vendorCSS)
	.pipe(gulp.dest('./build/style'));
});

// Compiles Sass
gulp.task('sass', function () {
	return gulp.src('./style/christmas-style.scss')
	.pipe($.sass({
		includePaths: paths.sass,
		outputStyle: ('nested'),
		errLogToConsole: true
	}))
	.pipe(gulp.dest('./build/style/'));
});

// Uglify/Concats the JS
gulp.task('uglify', ['uglify:plugins', 'uglify:js'], function() {
});

gulp.task('uglify:plugins', function() {
	return gulp.src(paths.pluginsJS)
	//.pipe($.concat('plugins.js'))
	.pipe(gulp.dest('build/script/'));
});

gulp.task('uglify:js', function() {
	return gulp.src(paths.js)
	.pipe($.concat('app.js'))
	.pipe(gulp.dest('build/script/'));
});

// Builds your entire app once, without starting a server
gulp.task('build', function(cb) {
	sequence('clean', ['copy', 'copy-css', 'sass', 'uglify'], cb);
});

// Default task: builds your app, starts a server, and recompiles assets when they change
gulp.task('default', ['server'], function() {
	// Watch Sass - TODO
	//gulp.watch(['./'+APP_DIR+'/assets/scss/**/*', './scss/**/*'], ['sass']);

	// Watch JavaScript - TODO
	//gulp.watch(['./'+APP_DIR+'/assets/js/**/*', './js/**/*'], ['uglify']);

	// Watch static files - TODO
	//gulp.watch(['./'+APP_DIR+'/**/*.*', './'+APP_DIR+'/templates/**/*.*', '!./'+APP_DIR+'/assets/{scss,js}/**/*.*'], ['copy']);
});
