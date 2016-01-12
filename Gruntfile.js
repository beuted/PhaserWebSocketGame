module.exports = function(grunt) {
    grunt.initConfig({
        bower: {
            public: {
                options: {
                    targetDir: './public/bower_components/',
                    cleanBowerDir: true
                }
            }
        },

        ts: {
            public : {
                options: {
                    module: 'amd'
                },
                src: ['public/**/*.ts', '!**/*.d.ts']
            },
            server : {
                options: {
                    module: 'commonjs'
                },
                src: ['app.ts', 'server/**/*.ts','!**/*.d.ts']
            }
        },

        tsd: {
            public: {
                options: {
                    command: 'reinstall',
                    config: './public/tsd.json'
                }
            },
            server: {
                options: {
                    command: 'reinstall',
                    config: './server/tsd.json'
                }
            }
        },

        nodemon: {
            server: {
                src: ['app.js']
            },
            options: {
                watch: ['server'],
                env: {
                    PORT: '8181'
                },
                delay: 2000,
            }
        },

        watch: {
            tsPublic: {
                files: './public/**/*.ts',
                tasks: ['ts:public'],
                options: {
                    atBegin: true,
                    livereload: true
                }
            },
            tsServer: {
                files: ['./server/**/*.ts', './app.ts'],
                tasks: ['ts:server'],
                options: {
                    atBegin: true
                }
            }
        },

        concurrent: {
            watchers: {
                tasks: ['nodemon:server', 'watch:tsServer', 'watch:tsPublic'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-tsd');

    grunt.registerTask('default', ['bower:public', 'tsd:public', 'tsd:server', 'ts:public', 'ts:server']);
    grunt.registerTask('dev', ['concurrent:watchers']);
};
