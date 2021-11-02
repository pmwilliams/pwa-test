const fileinclude = require('gulp-file-include');
const del = require('del');
const copy = require('gulp-copy');
const gulp = require('gulp');

gulp.task('default', function() {
  return gulp.series('clean', 'copy', 'fileinclude')();
});

gulp.task('clean', function(){
  return del(['docs']);
});

gulp.task('copy', function() {
  return gulp.src(['**/*.css', '**/*.html', '**/*.js', '**/*.png', '**/*.json', '!node_modules/**/*'])
    .pipe(copy('./docs'));
});

gulp.task('fileinclude', function() {
  return gulp.src(['docs/**/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: './'
    }))
    .pipe(gulp.dest('docs'));
});
