template = require './templates/login'
can.view.mustache 'layout', template

Controller = can.Control
    init: (el, opts) ->
        el.html can.view 'layout',
            'title': 'Hello world!'

    'route': ->
        console.log '/'

    'issue/new route': ->
        console.log '/issue/new'

    'account/signup route': ->
        console.log '/account/signup'

    'account/login route': ->
        console.log '/account/login'

    'body click': (el, evt) ->
        console.log 'click event'

module.exports = ->
    new Controller 'body', {}

    do can.route.ready