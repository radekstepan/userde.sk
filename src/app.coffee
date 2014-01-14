firebase = require './modules/firebase'
user     = require './modules/user'
account  = require './modules/account'
render   = require './modules/render'
state    = require './modules/state'
github   = require './modules/github'
options  = require './modules/options'

load = [
    'modules/helpers'
    'components/error'
    'components/header'
    'components/layout'
    'components/notify'
    'components/result'
    'components/results'
    'components/signup'
    'components/submit'
    'components/tutorial'
]

Routing = can.Control

    init: ->
        # Load the components & modules.
        ( require "./#{path}" for path in load )

    # Index page.
    route: ->
        template = require './templates/page/index'
        @render template

    # Submit an issue.
    ':owner/:repo route': (data) ->
        # Set the account.
        account "#{data.owner}/#{data.repo}"
        mixpanel.track('account', data)

        template = require './templates/page/submit'
        @render(template, {}, 'Submit an issue')

    # Signup for a new account.
    'signup route': ->
        template = require './templates/page/signup'
        @render template

    # Login to the account (NA).
    'login route': ->
        template = require './templates/page/login'
        @render template

    # Render a page. Update the page title.
    render: (template, ctx={}, title) ->
        @element.html(render(template, ctx))
        # Update title.
        document.title = if title then "#{title} - userde.sk" else 'userde.sk'

module.exports = (opts) ->
    # New client.
    firebase.attr 'client', opts.firebase

    # Start tracking.
    mixpanel.init(opts.mixpanel)

    # Save all the options.
    options.attr opts, no

    # Start routing.
    new Routing opts.el
    do can.route.ready