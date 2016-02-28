// Requis
var gulp = require('gulp');
var extender = require('gulp-html-extend');
var critical = require('critical').stream;

// Include plugins
var plugins = require('gulp-load-plugins')(); // tous les plugins de package.json

// Variables de chemins
var workDirectory = './src'; // dossier de travail
var publicDirectory = './web'; // dossier à livrer

gulp.task('css', function() {
    return gulp.src(workDirectory + '/assets/less/*.less')
        .pipe(plugins.less())
        .pipe(plugins.csscomb())
        .pipe(plugins.cssbeautify({indent: '  '}))
        .pipe(plugins.autoprefixer())
        .pipe(gulp.dest(workDirectory + '/assets/css/'));
});

gulp.task('mini', function() {
    return gulp.src(workDirectory + '/assets/css/*.css')
        .pipe(plugins.csso())
        .pipe(plugins.uncss({
            html: [workDirectory + '/views/contact.html']
        }))
        // ignore: ['[id="main"]:not(.is-closed)']
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.concat('global.min.css'))
        .pipe(gulp.dest(publicDirectory + '/css/'));
});

gulp.task('js', function(){
    gulp.src(workDirectory + '/assets/js/*.js')
        .pipe(plugins.uglify())
        .pipe(plugins.concat('global.min.js'))
        .pipe(gulp.dest(publicDirectory + '/js/'));
});

gulp.task('img', function() {
    return gulp.src(workDirectory + '/assets/img/*.{png,jpg,jpeg,gif,svg}')
        .pipe(plugins.imagemin())
        .pipe(gulp.dest(publicDirectory + '/img/'));
});

gulp.task('html', function() {
    return gulp.src(workDirectory + '/views/*.html')
        .pipe(extender({
            annotations: false,
            verbose: false
        }))
        .pipe(gulp.dest(publicDirectory + '/views/'));
});

gulp.task('critical', function() {
    return gulp.src(publicDirectory + '/views/*.html')
        .pipe(critical({
            base: publicDirectory,
            inline: true,
            css: publicDirectory + '/css/global.min.css',
            width: 320,
            height: 480,
            minify: true
        }))
        .pipe(gulp.dest(publicDirectory));
});

// Tâche "build"
gulp.task('build', ['css', 'js']);

// Tâche "prod" = toutes les tâches ensemble
//gulp.task('prod', gulpsync.sync(['css', 'mini', 'js', 'html', 'critical', 'img']));
gulp.task('prod', ['css', 'mini', 'js', 'html', 'critical', 'img']);

//// Tâche par défaut
gulp.task('default', ['build']);

gulp.task('watch', function() {
    gulp.watch([workDirectory + '/less/*.less', workDirectory + '/js/*.js'], ['build']);
});


