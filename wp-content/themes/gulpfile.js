// Project configuration
var project   = 'timber-starter-theme';

// Initialization sequence
var gulp      = require('gulp')
  , gutil     = require('gulp-util')
  , plugins   = require('gulp-load-plugins')({ camelize: true })
  , lr        = require('tiny-lr')
  , server    = lr()
  , build     = './'+project+'/';
;

gulp.task('styles', function() {
  return gulp.src(['assets/src/scss/*.scss', '!assets/src/scss/_*.scss'])
  .pipe(plugins.rubySass({ precision: 8 })) // Don't forget `gem install sass`; Compass not included
  .pipe(plugins.autoprefixer('last 2 versions', 'ie 9', 'ios 6', 'android 4'))
  .pipe(gulp.dest('assets/staging'))
  .pipe(plugins.minifyCss({ keepSpecialComments: 1 }))
  .pipe(plugins.livereload(server))
  .pipe(gulp.dest(build));
});

gulp.task('plugins', function() {
  return gulp.src(['assets/src/js/plugins/*.js', 'assets/src/js/plugins.js'])
  .pipe(plugins.concat(project+'-plugins.js'))
  .pipe(gulp.dest('assets/staging'))
  .pipe(plugins.rename({ suffix: '.min' }))
  .pipe(plugins.uglify())
  .pipe(plugins.livereload(server))
  .pipe(gulp.dest(build));
});

gulp.task('scripts', function() {
  return gulp.src(['assets/src/js/*.js', '!assets/src/js/plugins.js'])
  .pipe(plugins.jshint('.jshintrc'))
  .pipe(plugins.jshint.reporter('default'))
  .pipe(plugins.concat(project+'.js'))
  .pipe(gulp.dest('assets/staging'))
  .pipe(plugins.rename({ suffix: '.min' }))
  .pipe(plugins.uglify())
  .pipe(plugins.livereload(server))
  .pipe(gulp.dest(build));
});

gulp.task('images', function() {
  return gulp.src('assets/src/img/**/*')
  .pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 7, progressive: true, interlaced: true })))
  .pipe(plugins.livereload(server))
  .pipe(gulp.dest(build+'img/'));
});

gulp.task('clean', function() {
  return gulp.src(build+'**/.DS_Store', { read: false })
  .pipe(plugins.clean());
});

gulp.task('bower_components', function() { // Executed on bower update
  return gulp.src(['assets/bower_components/normalize.css/normalize.css'])
  .pipe(plugins.rename('_base_normalize.scss'))
  .pipe(gulp.dest('assets/src/scss'));
});

gulp.task('watch', function() {
  server.listen(35729, function (err) { // Listen on port 35729
    if (err) {
      return console.log(err)
    };
    gulp.watch('assets/src/scss/*.scss', ['styles']);
    gulp.watch('assets/src/js/**/*.js', ['plugins', 'scripts']);
    gulp.watch('assets/src/img/**/*', ['images']);
    gulp.watch(build+'**/*.php').on('change', function(file) { plugins.livereload(server).changed(file.path); });
  });
});

gulp.task('default', ['styles', 'plugins', 'scripts', 'images', 'clean', 'watch']);
