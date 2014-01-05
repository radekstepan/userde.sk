module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
       
        apps_c:
            commonjs:
                src: [ 'src/**/*.{coffee,mustache}' ]
                dest: 'build/js/userdesk.js'
                options:
                    main: 'src/app.coffee'
                    name: [ 'userde.sk', 'userdesk' ]

        stylus:
            compile:
                src: [
                    'src/styles/reset.styl'
                    'src/styles/app.styl'
                    'src/styles/forms.styl'
                    'src/styles/icons.styl'
                ]
                dest: 'build/css/userdesk.css'

        concat:            
            scripts:
                src: [
                    # Vendor dependencies.
                    'vendor/jquery/jquery.js'
                    'vendor/lodash/dist/lodash.js'
                    'vendor/moment/moment.js'
                    'vendor/superagent/superagent.js'

                    'vendor/canjs/can.jquery-2.js'
                    'vendor/canjs/can.map.setter.js'
                    
                    'vendor/firebase/lib/firebase.js'
                    'vendor/firebase/lib/firebase-simple-login.js'
                    
                    # Our app.
                    'build/js/userdesk.js'
                ]
                dest: 'build/js/userdesk.bundle.js'
                options:
                    separator: ';' # for minification purposes

            styles:
                src: [
                    # Vendor dependencies.
                    'vendor/normalize-css/normalize.css'
                    # Fonts.
                    'src/styles/fonts.css'
                    # Our compiled styles.
                    'build/css/userdesk.css'
                ]
                dest: 'build/css/userdesk.bundle.css'

        uglify:
            scripts:
                files:
                    'build/js/userdesk.min.js': 'build/js/userdesk.js'
                    'build/js/userdesk.bundle.min.js': 'build/js/userdesk.bundle.js'

        cssmin:
            combine:
                files:
                    'build/css/userdesk.min.css': 'build/css/userdesk.css'
                    'build/css/userdesk.bundle.min.css': 'build/css/userdesk.bundle.css'

        notify_hooks:
            options:
                duration: 1

        connect:
            server:
                options:
                    # Random port number.
                    port: 9001
                    # Access from anywhere.
                    hostname: '*'
                    # Serve this.
                    base: './public'
                    # Keep running.
                    keepalive: yes
                    # Debug.
                    debug: yes

    grunt.loadNpmTasks('grunt-apps-c')
    grunt.loadNpmTasks('grunt-contrib-stylus')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-cssmin')
    grunt.loadNpmTasks('grunt-notify')
    grunt.loadNpmTasks('grunt-contrib-connect')

    grunt.task.run('notify_hooks')

    grunt.registerTask('default', [
        'apps_c'
        'stylus'
        'concat'
    ])

    grunt.registerTask('minify', [
        'uglify'
        'cssmin'
    ])

    grunt.registerTask('server', [
        'connect'
    ])