user = require './user'

exports.isLoggedIn = isLoggedIn = (opts) ->
    if _.has (do user), 'username'
        opts.fn(@)
    else
        opts.inverse(@)

# Globally register as well.
Mustache.registerHelper 'isLoggedIn', isLoggedIn