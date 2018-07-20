var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var include = require("gulp-include");
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var del = require('del');
var gulpSequence = require('gulp-sequence');

gulp.task('html', function () {
  return gulp.src('./source/*.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('css', function () {
  return gulp.src('./source/sass/style.scss')
    .pipe(sass())
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: ['last 4 versions'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('js', function () {
  return gulp.src('./source/js/script.js')
    .pipe(include())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('images', function () {
  return gulp.src('./source/images/*')
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(gulp.dest('./build/images'));
});

gulp.task('watch', function () {
  gulp.watch('source/*.html', ['html']);
  gulp.watch('source/sass/**/*.scss', ['css']);
  gulp.watch('source/js/**/*.js', ['js']);
  gulp.watch('source/images/*', ['images']);
});

gulp.task('clean', function () {
  return del(['build/**/*']);
});

gulp.task('default', gulpSequence('clean',['html', 'css', 'js', 'images']));
