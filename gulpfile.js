let gulp = require('gulp');

// CSS
let sass = require('gulp-sass')(require('sass'));
let sourcemaps = require('gulp-sourcemaps');
let minifyCSS = require('gulp-csso');
let autoprefixer = require('gulp-autoprefixer');
let groupMediaQueries = require('gulp-group-css-media-queries');
// JS
let babel = require('gulp-babel');
let uglify = require('gulp-uglify');
let concat = require('gulp-concat');

let browserSync = require('browser-sync').create();
let notify = require('gulp-notify');

gulp.task('html', function() {
  return gulp.src('public/*.html')
    .pipe(browserSync.stream());
});

gulp.task('css', function() {
  return gulp.src('public/sass/main.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }))
    .on('error', notify.onError())
    .pipe(groupMediaQueries())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 4 versions']
    }))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('js', function() {
  return gulp.src('public/js/main.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('public/js'))
    .pipe(browserSync.stream());
});

gulp.task('default', gulp.series('html', 'css', function(done) {
  browserSync.init({
    server: {
      baseDir: 'public/'
    },
    port: 1337,
    notify: false
  });

  gulp.watch('public/*.html',  gulp.series('html'));
  gulp.watch('public/sass/**', gulp.series('css'));
  gulp.watch('public/js/main.js',   gulp.series('js'));
  done();
}));
