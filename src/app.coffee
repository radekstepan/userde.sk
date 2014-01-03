firebase = require './modules/firebase'
user     = require './modules/user'
account  = require './modules/account'
render   = require './modules/render'

components = [
    'header'
    'submit'
]

Routing = can.Control

    init: ->
        # Load the components.
        ( require "./components/#{name}" for name in components )

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

    # Start routing.
    new Routing opts.el
    do can.route.ready

    return

    # New client.
    firebase.attr 'client': new Firebase "https://#{opts.firebase_root}.firebaseio.com"

    # GitHub login.
    firebase.login (err, obj) ->
        throw err if err
        # Set the new user.
        user obj