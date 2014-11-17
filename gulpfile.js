var del = require('del');
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var vendorScripts = [
    './node_modules/rsvp/dist/rsvp.min.js'
];

gulp.task('dist', ['lib'], function() {
    return gulp.src(['./build/vendor.min.js', './build/lib.min.js'])
      .pipe(concat('mock-socks.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/'));
});

gulp.task('lib', ['vendor'], function() {
    return gulp.src('./lib/*.js')
      .pipe(concat('lib.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./build/'));
});

gulp.task('vendor', ['clean'], function() {
    return gulp.src(vendorScripts)
      .pipe(concat('vendor.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./build/'));
});

gulp.task('clean', function(cb) {
    del(['build', 'dist'], cb);
});

gulp.task('default', ['dist']);
