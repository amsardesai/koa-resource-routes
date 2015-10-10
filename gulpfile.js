'use strict';

let babel = require('gulp-babel');
let eslint = require('gulp-eslint');
let gulp = require('gulp');
let size = require('gulp-size');

/**
 * Build all our files.
 */
gulp.task('build', ['lint'], () => {
  return gulp.src('./src/*.js')
    .pipe(babel())
    .pipe(size({ title: 'Files' }))
    .pipe(gulp.dest('./build'));
});

/**
 * Lint all our files.
 */
gulp.task('lint', () => {
  return gulp.src('./src/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});
