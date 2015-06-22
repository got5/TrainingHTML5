
var gulp= require('gulp'),
  rimraf= require('gulp-rimraf'),
  uglify= require('gulp-uglify'),
  cssmin= require('gulp-minify-css'),
  concat= require('gulp-concat'),
  mbf= require('main-bower-files'),
  gfilter= require('gulp-filter'),
  usemin=require('gulp-usemin'),
  http= require('http'),
  express= require('express'),
  npmPackage= require('./package.json'),
  baseProject= __dirname;

var appJsGlobs=['src/js/**/*.js'],
    appImages= ['src/imgs/**/*'];

var target='dist',
    targetAppName= npmPackage.name;


gulp.task('express', function(cb){

    var port= 8080,
        server= http.createServer(express()
        .use(express.static(baseProject + '/src'))
        .use(express.static(baseProject + '/bower_components/')));

      server.listen(8080, function(){console.log('Listening on ' + port); cb()});
  
});

//BUILD PART

gulp.task('clean', function (cb) {
  return gulp.src('./' + target)
  .pipe(rimraf({force:true}));
});


gulp.task('copy-resources', ['clean'], function(){
  return gulp.src(['src/data/**/*', 'src/views/**/*'], {base:'./src'})
  .pipe(gulp.dest('./' + target));
});

gulp.task('mbf', ['clean'], function(){

  var imgsFilter= gfilter(['**/*.jpg', '**/*.png', '**/*.gif']);

  return gulp.src(mbf())
  .pipe(imgsFilter)
  .pipe(gulp.dest('./' + target  + '/imgs'));

});

gulp.task('usemin', ['clean'], function(){
  return gulp.src('./src/index.html')
    .pipe(usemin({
      ext_css: [cssmin(), 'concat'],
      css: [cssmin(), 'concat'],
      // ext_js: [uglify({output:{beautify:true}}), 'concat'],
      ext_js: [uglify(), 'concat'],
      js: [uglify(), 'concat']
    }))
    .pipe(gulp.dest('./' + target));
  }
);

gulp.task('build', ['copy-resources', 'mbf', 'usemin']);

gulp.task('default', ['build']);