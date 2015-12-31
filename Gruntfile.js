module.exports = function(grunt) {

    grunt.initConfig({
        ts: {
            client : {
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
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.registerTask("default", ["ts:client", "ts:server"]);
};
