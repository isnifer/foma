var gulp = require('gulp');
var connect = require('gulp-connect');

var js = ['./demo/js/demo.js'];

gulp.task('js', function () {
  return gulp.src(js)
      .pipe(connect.reload());
});

gulp.task('connect', function() {
    connect.server({
        root: 'demo',
        livereload: true,
        port: 12934
    });
});

gulp.task('watch', function () {
    gulp.watch(js, ['js']);
});

gulp.task('default', ['connect', 'watch']);
