user = require './user'

exports.isLoggedIn = isLoggedIn = (opts) ->
    if _.has (do user), 'username'
        opts.fn(@)
    else
        opts.inverse(@)

exports.ago = ago = (time, opts) ->
    do moment(do time).fromNow

# Globally register as well.
Mustache.registerHelper 'isLoggedIn', isLoggedIn
Mustache.registerHelper 'ago', ago