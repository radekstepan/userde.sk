do require './core/templates'
canController = require './core/controller'

class Controller extends canController

    init: (el, opts) ->

    route: ->
        console.log '/'

    'issue/new route': ->
        @element.html can.view 'issue'

    'account/signup route': ->
        @element.html can.view 'signup'

    'account/login route': ->
        @element.html can.view 'login'

    'body click': (el, evt) ->
        console.log 'click event'

module.exports = ->
    new Controller 'body', {}

    do can.route.ready