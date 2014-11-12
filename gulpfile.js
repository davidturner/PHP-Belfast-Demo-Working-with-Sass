var gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    insert = require('gulp-insert'),
    replace = require('gulp-replace'),
    connect = require('gulp-connect'),
    changed = require('gulp-changed'),
    fileinclude = require('gulp-file-include'),
    glob = require('glob'),
    minifyCSS = require('gulp-minify-css'),

    // App Variables For our usage
    app = {
      title: 'Gulp Invited',
      url: 'https://getinvited.to/',
      author: 'Get Invited Ltd',
      version: '0.0.2.[stamp]',
      copyright: '© ' + new Date().getFullYear(),
      build: './build/',
      ship: './ship/'
    };

// Banner variables for CSS/JS files
var banner = {
    css: '@charset "UTF-8";\n' +
         '/*!\n' + ' * ' + app.title + '\n' +
         ' * ' + app.url + '\n' +
         ' * @author ' + app.author + '\n' +
         ' * @version ' + app.version + '\n' +
         ' * Copyright ' + app.copyright + '\n' +
         ' * Slate Framework v0.0.2 | MIT License | davidturner.name\n' +
         ' * normalize.css v2.1.0 | MIT License | git.io/normalize\n' +
         ' */\n',
    js: '/*!\n' +
        ' * ' + app.title + '\n' +
        ' * ' + app.url + '\n' +
        ' * @author ' + app.author + '\n' +
        ' * @version ' + app.version + '\n' +
        ' * Copyright ' + app.copyright + '\n' +
        ' */\n'
};

gulp.task('connect', function() {
  connect.server({
    root: ['ship'],
    port: 9000,
    livereload: true
  });
});


gulp.task('images', function() {
  'use strict';
  gulp.src(app.build + 'img/*.{png,jpg,gif,svg}')
      .pipe(gulp.dest(app.ship + 'img'))
      .pipe(connect.reload());
});
gulp.task('html', function() {
  'use strict';
  gulp.src([app.build + '**/*.html', '!' + app.build + '**/_*.html'])
      .pipe(gulp.dest(app.ship))
      .pipe(connect.reload());
});

// Compile Our Sass
gulp.task('sass', function() {
  'use strict';
  gulp.src(app.build + 'scss/site.live.scss')
      .pipe(sass())
      .pipe(prefix('last 1 version', '> 1%', 'ie 8', { map: true, to: 'site.live.css' }))
      .pipe(insert.prepend(banner.css))
      .pipe(replace('*/@charset "UTF-8";', '*/\n'))
      .pipe(replace('*/', '*/\n'))
      .pipe(replace('/*', '\n/*'))
      .pipe(replace('\n\n', '\n'))
      .pipe(replace('\n\n', '\n'))
      .pipe(replace(banner.css + '{', '{'))
      .pipe(replace('[stamp]', new Date().getTime()))
      .pipe(minifyCSS({keepSpecialComments: 1}))
      .pipe(replace('*/', '*/\n'))
      .pipe(gulp.dest(app.ship + 'css'))
      .pipe(connect.reload());
});
// Concatenate & Minify JS
gulp.task('scripts', function() {
  'use strict';
  gulp.src(app.build + 'js/*.js')
      .pipe(insert.prepend(banner.js))
      .pipe(replace('[stamp]', new Date().getTime()))
      .pipe(gulp.dest(app.ship + 'js/'))
      .pipe(connect.reload());
});

// Watch Files For Changes
gulp.task('watch', function() {
  'use strict';
  gulp.watch(app.build + 'js/*.js', ['scripts']);
  gulp.watch(app.build + 'scss/**/**/*.css', ['sass']);
  gulp.watch(app.build + 'img/**/*.{png,jpg,gif,svg}', ['images']);
  gulp.watch(app.build + '*.html', ['html']);
});

// Default Task
gulp.task('default', ['html', 'scripts', 'images', 'sass', 'watch', 'connect']);