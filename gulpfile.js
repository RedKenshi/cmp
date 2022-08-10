'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

sass.compiler = require('node-sass');
var sass = require('gulp-sass')(require('sass'));

gulp.task('sass', function () {
   gulp.src('./client/css/bulma.scss')
   .pipe(concat('bulma.scss'))
   .pipe(sass().on('error', sass.logError))
   .pipe(gulp.dest('./client/css/'));

   gulp.src('./client/css/toast.scss')
   .pipe(concat('toast.scss'))
   .pipe(sass().on('error', sass.logError))
   .pipe(gulp.dest('./client/css/'));
   
   return gulp.src('./client/css/scss/*.scss')
   .pipe(concat('custom.scss'))
   .pipe(sass().on('error', sass.logError))
   .pipe(gulp.dest('./client/css/'));
});

gulp.task('sass:watch', function () {
   gulp.watch(['./client/css/scss/*.scss','./client/css/scss/elements/*.scss'], gulp.series('sass'));
 });