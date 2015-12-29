module.exports = function(grunt) {

  grunt.initConfig({
    ts: {
      default : {
      	options: {
      		module: 'amd'
      	},
        src: ["public/**/*.ts", "!public/typings/**/*"],
      }
    }
  });


  grunt.loadNpmTasks("grunt-ts");
  grunt.registerTask("default", ["ts"]);
};
