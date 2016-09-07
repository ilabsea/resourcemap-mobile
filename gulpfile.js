var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var jsonminify = require('gulp-jsonminify');

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'www'
    },
  })
})

gulp.task('useref', function () {
  return gulp.src('www/*.html')
    .pipe(useref())
    .pipe(gulpIf('js/*.js', uglify()))
    .pipe(gulpIf('css/*.css', cssnano()))
    .pipe(gulp.dest('www/dist'))
})

gulp.task('jsonminify', function () {
  return gulp.src('www/locales/**/*.json')
    .pipe(jsonminify())
    .pipe(gulp.dest('www/dist/locales'));
});

gulp.task('images', function(){
  return gulp.src('www/img/*.+(png|gif)')
      .pipe(cache(imagemin({
        interlaced: true
      })))
      .pipe(gulp.dest('www/dist/img'))
});

gulp.task('fonts', function() {
  return gulp.src('www/font/*')
    .pipe(gulp.dest('www/dist/font'))
})

gulp.task('templates', function(){
  gulp.src('www/js/app/templates/*.hbs')
    .pipe(handlebars({handlebars: require('handlebars')}))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'AppHandlebars.templates',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('www/build/js/'));
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
})

gulp.task('cache:clear', function(callback) {
  return cache.clearAll(callback)
})

gulp.task('watch', ['browserSync'], function (){
  gulp.watch('www/*.html', browserSync.reload);
  gulp.watch('www/js/**/*.js', browserSync.reload);
  gulp.watch('www/css/**/*.css', browserSync.reload);
  gulp.watch('www/js/app/templates/*.hbs', browserSync.reload);
})

gulp.task('build', function (callback){
  runSequence('clean:dist', ['templates', 'useref', 'images', 'fonts','jsonminify'], callback)
})

gulp.task('default', function(callback) {
  runSequence(['browserSync', 'watch'], callback)
})
