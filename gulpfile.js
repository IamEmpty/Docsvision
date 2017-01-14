const gulp = require('gulp'),
  fs = require('fs'),
  // replace = require('gulp-replace'),
  // htmlmin = require('gulp-htmlmin'),
  // nano = require('gulp-cssnano'),
  // spritesmith = require('gulp.spritesmith'),
  // merge = require('merge-stream'),
  plugins = require('gulp-load-plugins')();

const paths = {
  jade: 'pages/*.pug',
  jadeWatch: [
    'pages/*.pug',
    'layouts/*.pug'
  ],
  stylus: [
    'stylesheets/main.styl'
  ],
  stylusWatch: [
    'blocks/**/*.styl',
    'stylesheets/main.styl'
  ],
  images: 'img/**/*.{png,jpg}',
  css: 'bower_components/normalize-css/normalize.css',
  cssToCopy: [
    'bower_components/normalize-css/normalize.css'
  ],
  js: 'js/*.js',
  jsToCopy: [
    'js/*.js',
    'bower_components/jquery/dist/jquery.min.js'
  ],
  build: 'build/',
  dist: 'dist/'
};

// Get one .styl file and render
function css() {
  return gulp.src(paths.stylus)
    .pipe(plugins.plumber())
    .pipe(plugins.stylus({
      'include css': true
    }))
    .pipe(gulp.dest(paths.build + 'css/'));
}

function html() {
  return gulp.src(paths.jade)
    .pipe(plugins.plumber())
    .pipe(plugins.pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.build));
}

function minifyCss() {
  return gulp.src(paths.stylus)
    .pipe(plugins.plumber())
    .pipe(plugins.stylus({
      'include css': true
    }))
    .pipe(nano())
    .pipe(gulp.dest(paths.dist + 'css/'));
}

function minifyHtml() {
  return gulp.src(paths.jade)
    .pipe(plugins.plumber())
    .pipe(plugins.pug())
    // Css from file to inline
    .pipe(replace(/<link href="above-the-fold.css" rel="stylesheet">/, function(s) {
      var style = fs.readFileSync('dist/css/above-the-fold.css', 'utf8');
      return '<style>\n' + style + '\n</style>';
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.dist));
}

function copyImages() {
  return gulp.src(paths.images)
    .pipe(gulp.dest(paths.build + 'img/'));
}

function copyJs() {
  return gulp.src(paths.jsToCopy)
    .pipe(gulp.dest(paths.build + 'js/'));
}

function copyCss() {
  return gulp.src(paths.cssToCopy)
    .pipe(gulp.dest(paths.build + 'css/'));
}

const copy = gulp.parallel(copyImages, copyJs, copyCss);


function copyImagesToDist() {
  return gulp.src(paths.images)
    .pipe(gulp.dest(paths.dist + 'img/'));
}

function copyJsToDist() {
  return gulp.src(paths.js)
    .pipe(gulp.dest(paths.dist + 'js/'));
}

const copyToDist = gulp.series(copyImagesToDist, copyJsToDist);


function sprite() {
  // Generate our spritesheet
  let spriteData = gulp.src('img/previews/*.jpg')
    .pipe(spritesmith({
      imgName: '../img/sprites/sprite.png',
      cssName: 'sprite.styl'
    }));

  // Pipe image stream through image optimizer and onto disk
  let imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    // .pipe(buffer())
    // .pipe(imagemin())
    .pipe(gulp.dest('./sprites/'));

  // Pipe CSS stream through CSS optimizer and onto disk
  let cssStream = spriteData.css
    // .pipe(csso())
    .pipe(gulp.dest('stylesheets/'));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
}

// Rerun the task when a file changes
function watch() {
  gulp.watch(paths.stylusWatch, css);
  gulp.watch(paths.jadeWatch, html);
  gulp.watch(paths.js, copyJs);
}

// The default task (called when you run `gulp` from cli)
const build = gulp.series(html, css, copy, watch);
gulp.task('build', build);
gulp.task('dist', gulp.series(minifyCss, minifyHtml, copyToDist, sprite));

gulp.task('deploy', gulp.series('dist', function() {
  return gulp.src(paths.dist + '**/*')
    .pipe(plugins.ghPages());
}));

gulp.task('default', build);
