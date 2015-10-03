'use strict';

let babel = require('gulp-babel');
let gulp = require('gulp');
let size = require('gulp-size');

/**
 * Build all our files.
 */
gulp.task('build', () => {
  return gulp.src('./src/*.js')
    .pipe(babel({
      stage: 0,
      loose: true,
      blacklist: [
        'regenerator',
        'react',
      ],
    }))
    .pipe(size({ title: 'Files' }))
    .pipe(gulp.dest('./build'));
});

