module.exports = ->
    # Load templates.
    for name in [ 'issue', 'login', 'signup' ]
        tml = require "../templates/#{name}"
        can.view.mustache name, tml