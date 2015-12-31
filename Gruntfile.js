module.exports = function(grunt) {
    grunt.initConfig({
        ts: {
            public : {
                options: {
                    module: 'amd'
                },
                src: ["public/**/*.ts", "!**/*.d.ts"],
            },
            server : {
                options: {
                    module: 'commonjs'
                },
                src: ["app.ts", "server/**/*.ts","!**/*.d.ts"],
            }
        },

        tsd: {
            public: {
                options: {
                    command: 'reinstall',
                    config: './public/tsd.json',
                }
            },
            server: {
                options: {
                    command: 'reinstall',
                    config: './server/tsd.json',
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-tsd");

    grunt.registerTask("default", ["tsd:public", "tsd:server", "ts:public", "ts:server"]);
};
