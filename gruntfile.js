module.exports = function(grunt) {
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist'],
        uglify: {
            options: {
                mangle: false
            },
            dist: {
                files: {
                    'dist/miniPopup.min.js': ['src/miniPopup.js']
                }
            }
        },
        jsdoc: {
            dist: {
                src: ['src/miniPopup.js'],
                options: {
                    destination: 'dist/doc'
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-jsdoc");

    grunt.registerTask('default', ['clean', 'uglify']);
};
