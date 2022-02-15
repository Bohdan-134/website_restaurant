const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const gulpPug = require("gulp-pug");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const gulpRename = require("gulp-rename");
const cleanCss = require("gulp-clean-css");
const webp = require("gulp-webp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const del = require("del");

const paths = {
  pug: {
    src: "src/pug/**/*.pug",
    dest: "dist/",
  },
  html: {
    src: "src/*.html",
    dest: "dist/",
    pages: "dist/pages/"
  },
  styles: {
    src: "src/styles/**/*.scss",
    dest: "dist/css/",
  },
  scripts: {
    src: "src/scripts/**/*.js",
    dest: "dist/js/",
  },
  fonts: {
    src: "src/fonts/**/*.{otf,ttf}",
    dest: "dist/fonts",
  },
  images: {
    src: "src/img/*",
    dest: "dist/img",
  },
};

function clean() {
  return del(["dist"]);
}

function pug() {
  return gulp
    .src(paths.pug.src)
    .pipe(gulpPug())
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp
    .src(paths.scripts.src, {
      sourcemaps: true,
    })
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(uglify())
    .pipe(concat("main.js"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

function fonts() {
  return gulp.src(paths.fonts.src).pipe(gulp.dest(paths.fonts.dest));
}

function images() {
  return gulp
    .src(paths.images.src)
    .pipe(webp())
    .pipe(gulp.dest(paths.images.dest));
}

function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(
      gulpRename({
        basename: "main",
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./dist/",
    },
  });
  gulp.watch(paths.html.dest).on("change", browserSync.reload);
  gulp.watch(paths.html.pages).on("change", browserSync.reload);
  gulp.watch(paths.pug.src, pug);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.fonts.src, fonts);
  gulp.watch(paths.images.src, images);
}

const build = gulp.series(
  clean,
  pug,
  gulp.parallel(styles, scripts, images, fonts),
  watch
);

exports.clean = clean;
/* exports.html = html; */
exports.pug = pug;
exports.styles = styles;
exports.watch = watch;
exports.scripts = scripts;
exports.fonts = fonts;
exports.images = images;
exports.build = build;
exports.default = build;
