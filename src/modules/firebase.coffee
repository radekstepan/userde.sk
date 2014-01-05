user  = require './user'
state = require '../modules/state'

# Default "silent" callback for auth.
authCb = ->

module.exports = new can.Map

    setClient: (root, success, error) ->
        # Create a new instance pointing to a root.
        client = new Firebase "https://#{root}.firebaseio.com"

        # Check if we have a user in session.
        state.load 'Loading'

        @attr 'auth', new FirebaseSimpleLogin client, (err, obj) ->
            if err or not obj
                do state.none unless obj
                return authCb err

            # Save user in memory.
            user obj

            state.info "#{obj.displayName} is logged in"

            # Call back.
            do authCb

        client

    login: (cb, provider='github') ->
        return cb 'Client is not setup' unless @client
        
        # Override the default auth callback.
        authCb = cb

        # Login.
        state.load 'Connecting GitHub account'
        @auth.login provider,
            # 30 days.
            'rememberMe': yes
            # See: http://developer.github.com/v3/oauth/#scopes
            'scope': 'public_repo'

    logout: ->
        do @auth?.logout
        user {}
        # TODO: fixme
        state.info 'You have logged out'