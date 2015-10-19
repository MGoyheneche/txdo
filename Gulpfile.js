var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('start', function () {
  nodemon({
    script: 'server/index.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' }
  })
})
