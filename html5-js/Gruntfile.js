'use strict';

module.exports = function(grunt){

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        html2js:{
            directives:{
                options:{
                    base:'app'
                },
                src:['app/editor/templates/*.html'],
                dest: 'app/editor/templates.js',
                module:false
            }
        },
        concat: {
            options: {
                separator: ';\n',
                line:true,
                block:true,
                stripBanners:true
            },
            editor:{
                src:['app/editor/templates.js','app/editor/training-editor.js','app/editor/js/**/*.js'],
                dest:'temp/editor.js'
            },

            app: {
                src: [ 'app/js/**/*.js'],
                dest: 'temp/app.js'
            },
            /*css: {
                src: ['app/styles/animation.css','app/styles/bootstrap.css','app/styles/main.css'],
                dest: 'prod/styles/styles.css'
            },*/
            dep: {
                src: [
                    'app/vendor/modernizr/modernizr.js',
                    'app/vendor/jquery/dist/jquery.min.js',
                    'app/vendor/ace-builds/src-min/ace.js',
                    'app/vendor/ace-builds/src-min/ext-language_tools.js',
                    'app/vendor/angular/angular.min.js',
                    'app/vendor/angular-route/angular-route.min.js',
                    'app/vendor/angular-animate/angular-animate.min.js',
                    'app/vendor/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min.js'
                ],
                dest: 'temp/dep.js'
            },
            prod:{
                src:['temp/dep.js','temp/editor.js','temp/app.js'],
                dest: 'prod/js/script.js'
            }
        },

        watch: {
            js: {
                files: ['app/js/**/*.js', 'test/unit/**/*.js'],
                tasks: ['karma:unit:run'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['app/style/**/*.css'],
                tasks: [],
                options: {
                    livereload: true
                }
            }
        },

        copy: {
            prod: {
                cwd: 'app/',
                expand: true,
                src: ['data/**','images/**','styles/**','partials/**','favicon.ico','index.html'],
                dest: 'prod/'
            },
            ace:{
                cwd:'app/vendor/ace-builds/src-min/',
                expand:true,
                src:['**'],
                dest: 'prod/'

            }
        },


        uglify: {
            prod: {
                files: [{
                    expand: true,
                    cwd: 'prod/js',
                    src: '**/*.js',
                    dest: 'prod/js'
                }],
                options: {
                    mangle: true
                }
            }
        },

        cssmin: {
            combine: {
                options: {
                    banner: '/* CSS Minified stylesheet */'
                },
                files: {
                    'prod/styles/styles.css': ['prod/styles/styles.css']
                }
            }
        },

        htmlmin: {
            prod: {
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'prod/',
                    src: ['index.html'],
                    dest: 'prod/'
                }
                ]
            }
        },

        clean: {
            prodpre: {
                src: ["prod/*"]
            },
            temp:{
                src:['temp/*']
            }
        }



    });

    require('matchdep').filterDev('grunt-contrib-*').forEach(grunt.loadNpmTasks);
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask("build", [
        "clean:prodpre",
        "html2js",
        "concat",
        "copy:prod",
        //"cssmin",
        "uglify:prod",
        "clean:temp",
        "copy:ace",
        "htmlmin:prod"
    ]);

};