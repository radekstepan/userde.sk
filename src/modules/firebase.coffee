module.exports = new can.Map

    client: null

    login: (cb, provider='github') ->
        return cb 'Client is not setup' unless @client
        
        auth = new FirebaseSimpleLogin @client, cb
        
        auth.login provider