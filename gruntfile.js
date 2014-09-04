module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-jsdoc");

    grunt.registerTask('default', ['clean', 'uglify', 'jsdoc']);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dest'],
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'dest/miniPopup.min.js': ['src/miniPopup.js']
                }
            }
        },
        jsdoc: {
            dist: {
                src: ['src/miniPopup.js'],
                options: {
                    destination: 'dest/doc'
                }
            }
        }
    });
};
