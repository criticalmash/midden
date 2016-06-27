'use strict';
/**
 * Gulp file for building client-side assets and testing them against midden() output
 */

var path = require('path');
var gulp = require('gulp');
var through = require('through2');
var File = require('vinyl');
var debug = require('gulp-debug');
var express = require('express');
var browserSync = require('browser-sync');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var minimist = require('minimist');
var rename = require("gulp-rename");

/* The function to be tested */
var midden = require('.');

/* globals */
var middenOutput = {};
var server;
var options = minimist(process.argv);
var environment = options.environment || 'development';

/*****************************************************
 * Define plugins
 *****************************************************/
function middenware() {
  return through.obj(function(file, encoding, callback) {
    //console.log('file path', path.basename(file.path));
    //console.log('json file contents', file.contents.toString());
    var stem = path.basename(file.path, '.json');
    
    middenOutput[stem] = midden(JSON.parse(file.contents.toString()), stem);
    //console.log('midden out (' + stem + '): ', middenOutput[stem]);
    callback(null, file);
    return;
  });
}

function middenInsert() {
  return through.obj(function(file, encoding, callback) {
    // find faux-handlebars tag and replace with midden output
    
    file.contents = new Buffer(file.contents.toString().replace('{{middenoutput}}', middenOutput.simple));
    callback(null, file);
    return;
  });
}

function amIVinyl() {
  return through.obj(function(file, encoding, callback) {
    console.log('basename: ', path.basename(file.path));
    console.log('Is vinyl? ', File.isVinyl(file));
    callback(null, file);
    return;
  });
}

/*****************************************************
 * Define Tasks
 *****************************************************/
/**
 * will generate test docs so we can see how the end product is working
 * 
 */
gulp.task('midden', function(){
  return gulp.src('test/data/**/*.json')
    .pipe(middenware())
    .pipe(debug());
});

gulp.task('html', ['midden'], function() {
  return gulp.src('src/html/**/*.html')
    .pipe(middenInsert())
    // .pipe(debug())
    .pipe(gulp.dest('dist'))
    .pipe(reload());
});

/**
 * generate style-sheets to format midden output
 * midden.scss (just copy the file to build)
 * midden.css (from scss file)
 * midden.min.css (minified)
 */
gulp.task('styles', function() {
  return gulp.src('src/scss/**/*.scss')
    .on('error', handleError)
    .pipe(gulp.dest('dist/styles'))
    .pipe(sass())
    .pipe(gulp.dest('dist/styles'))
    .pipe(minifyCss())
    .pipe(rename(function(path){
      path.basename += ".min";
    }))
    .pipe(gulp.dest('dist/styles'))
    .pipe(reload());
});

/**
 * generate client-side script files for testing & production
 * midden.js (should work as is or return a handle when required())
 * midden.min.js (uglified version of same)
 */
gulp.task('script', function() {
  return gulp.src('src/js/midden-client.js')
  .pipe(gulp.dest('dist/js'))
  .pipe(reload());
});

/**
 * launches an http server for testing of above
 */
gulp.task('server', function(){
  server = express();
  server.use(express.static('dist'));
  server.listen(8000);
  browserSync({ proxy: 'localhost:8000'});
});

gulp.task('watch', function(){
  gulp.watch('src/html/**/*.html', ['html']);
  gulp.watch('test/data/**/*.json', ['html']);
  gulp.watch('src/scss/**/*.scss', ['styles']);
  gulp.watch('src/js/**/*.js', ['script']);
});

gulp.task('default', ['html', 'script', 'styles', 'watch', 'server']);

/**
 * util function to test if a reload is needed
 * @return {[type]} [description]
 */
function reload(){
  if(server) {
    return browserSync.reload({ stream: true});
  }
  return gutil.noop();
}

/**
 * function to gracefully handle errors
 * @param  {[type]} err [description]
 * @return {[type]}     [description]
 */
function handleError(err){
  console.log(err.toString());
  this.emit('end');
}
