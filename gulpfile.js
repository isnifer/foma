var gulp = require('gulp');
var connect = require('gulp-connect');

var jsx = ['./demo/js/demo.js'];

gulp.task('js', function () {
  return gulp.src(jsx)
      .pipe(connect.reload());
});

gulp.task('connect', function() {
    connect.server({
        root: 'demo',
        livereload: true,
        port: 12453
    });
});

gulp.task('watch', function () {
    gulp.watch(jsx, ['js']);
});

gulp.task('default', ['connect', 'watch']);
