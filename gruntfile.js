module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask('default', 'uglify');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
			options: {
			  mangle: false
			},
			my_target: {
			  files: {
				'dest/tinyPopup.min.js': ['tinyPopup.js']
			  }
			}
		}
    });
};
