const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const gulpRename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const del = require('del');

const paths = {
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/dist/js/ '
    }
}

function clean() {
   return del(['dist'])
}

function scripts() {
   return gulp.src(paths.scripts.src, {
       sourcemaps: true
   })
   .pipe(babel())
   .pipe(uglify())
   .pipe(concat('main.js'))
   .pipe(gulp.dest(paths.scripts.dest))
}

function styles() {
   return gulp.src(paths.styles.src)
       .pipe(sass())
       .pipe(cleanCss())
       .pipe(gulpRename({
           basename: 'main'
       }))
       .pipe(gulp.dest(paths.styles.dest))
}

const build = gulp.series(clean, gulp.parallel(styles, scripts), watch)

function watch() {
   gulp.watch(paths.styles.src, styles)
   gulp.watch(paths.scripts.src, scripts)
}

/* exports.clean = clean; */
exports.styles = styles; 
exports.watch = watch;
exports.scripts = scripts;
exports.build = build;
exports.default = build;