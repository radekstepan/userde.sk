firebase = require './modules/firebase'
user     = require './modules/user'
account  = require './modules/account'
render   = require './modules/render'

load = [
    'modules/helpers'
    'components/header'
    'components/submit'
]

Routing = can.Control

    init: ->
        # Load the components & modules.
        ( require "./#{path}" for path in load )

    # Index, submit an issue for now.
    route: ->
        template = require './templates/page/issue'
        @render(template, {}, 'Submit an issue')

    # Render a page. Update the page title.
    render: (template, ctx, title) ->
        @element.html(render(template, ctx))
        # Update title.
        document.title = if title then "#{title} - userde.sk" else 'userde.sk'

module.exports = (opts) ->
    # Which account?
    account opts.account
    
    # New client.
    firebase.attr 'client', opts.firebase

    # Start routing.
    new Routing opts.el
    do can.route.ready