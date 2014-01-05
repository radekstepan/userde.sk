user = require './user'

exports.isLoggedIn = isLoggedIn = (opts) ->
    if _.has (do user), 'username'
        opts.fn(@)
    else
        opts.inverse(@)

exports.ago = ago = (time, opts) ->
    do moment(do time).fromNow

# Generate an avatar for a user.
# Direct rendering does not work.
exports.avatar = avatar = (size=40) ->
    url = (do user).avatar_url + "&s=#{size}"
    can.Mustache.safeString "<img src='#{url}'>"

# Globally register as well.
Mustache.registerHelper 'isLoggedIn', isLoggedIn
Mustache.registerHelper 'ago', ago
Mustache.registerHelper 'avatar', avatar