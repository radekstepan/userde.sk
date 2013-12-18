module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")

        # handlebars:
        #     templates:
        #         src: [ 'src/**/*.hbs' ]
        #         dest: 'build/templates.js'
        #         options:
        #             node: yes
        #             namespace: 'JST'
        
        apps_c:
            commonjs:
                src: [ 'src/**/*.{coffee,js,eco,mustache}' ]
                dest: 'build/app.js'
                options:
                    main: 'src/app.coffee'
                    name: 'app'

        # clean: [
        #     'build/templates.js'
        # ]

        stylus:
            compile:
                src: [
                    'src/styles/reset.styl'
                    'src/styles/app.styl'
                    'src/styles/forms.styl'
                ]
                dest: 'build/app.css'

        concat:            
            scripts:
                src: [
                    # Vendor dependencies.
                    'vendor/jquery/jquery.js'
                    'vendor/lodash/dist/lodash.js'
                    'vendor/canjs/can.jquery.js'
                    # Our app.
                    'build/app.js'
                ]
                dest: 'build/app.bundle.js'
                options:
                    separator: ';' # for minification purposes

            styles:
                src: [
                    # Vendor dependencies.
                    'vendor/normalize-css/normalize.css'
                    # Fonts.
                    'src/styles/fonts.css'
                    # Our compiled styles.
                    'build/app.css'
                ]
                dest: 'build/app.bundle.css'

        uglify:
            scripts:
                files:
                    'build/app.min.js': 'build/app.js'
                    'build/app.bundle.min.js': 'build/app.bundle.js'

        cssmin:
            combine:
                files:
                    'build/app.min.css': 'build/app.css'
                    'build/app.bundle.min.css': 'build/app.bundle.css'

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

    #grunt.loadNpmTasks('grunt-contrib-handlebars')
    grunt.loadNpmTasks('grunt-apps-c')
    grunt.loadNpmTasks('grunt-contrib-stylus')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-cssmin')
    grunt.loadNpmTasks('grunt-notify')
    grunt.loadNpmTasks('grunt-contrib-connect')
    #grunt.loadNpmTasks('grunt-contrib-clean')

    grunt.task.run('notify_hooks')

    grunt.registerTask('default', [
        #'handlebars'
        'apps_c'
        #'clean'
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