user = require './user'

auth = null

module.exports = new can.Map

    client: null

    login: (cb, provider='github') ->
        return cb 'Client is not setup' unless @client
        
        do auth?.logout

        auth = new FirebaseSimpleLogin @client, (err, obj) ->
            user obj
            cb err
        
        auth.login provider,
            'rememberMe': yes # 30 days

    logout: ->
        do auth?.logout
        user {}