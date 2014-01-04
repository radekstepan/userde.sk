user = require './user'

# Default "silent" callback for auth.
authCb = ->

module.exports = new can.Map

    setClient: (root, success, error) ->
        # Create a new instance pointing to a root.
        client = new Firebase "https://#{root}.firebaseio.com"

        # Check if we have a user in session.
        @auth = new FirebaseSimpleLogin client, (err, obj) ->
            # Trouble?
            return authCb err if err

            # Save user in memory.
            user obj

            # Call back.
            do authCb

        client

    login: (cb, provider='github') ->
        return cb 'Client is not setup' unless @client
        
        # Override the default auth callback.
        authCb = cb

        # Login.
        @auth.login provider,
            'rememberMe': yes # 30 days

    logout: ->
        do @auth?.logout
        user {}