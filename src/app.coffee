firebase = require './modules/firebase'
user     = require './modules/user'
account  = require './modules/account'
render   = require './modules/render'
state    = require './modules/state'

load = [
    'modules/helpers'
    'components/header'
    'components/submit'
    'components/notify'
    'components/results'
    'components/result'
    'components/error'
]

Routing = can.Control

    init: ->
        # Load the components & modules.
        ( require "./#{path}" for path in load )

    # Index page.
    route: ->

    # Submit an issue.
    ':owner/:repo route': (data) ->
        # Set the account.
        account "#{data.owner}/#{data.repo}"

        template = require './templates/page/submit'
        @render(template, {}, 'Submit an issue')

    # Render a page. Update the page title.
    render: (template, ctx, title) ->
        @element.html(render(template, ctx))
        # Update title.
        document.title = if title then "#{title} - userde.sk" else 'userde.sk'

module.exports = (opts) ->  
    # New client.
    firebase.attr 'client', opts.firebase

    # Start routing.
    new Routing opts.el
    do can.route.ready