canControl   = require './core/control'
canComponent = require './core/component'

# Which account are we "connected" to.
account = can.compute('intermine')

# Show header only on internal pages.
showHeader = can.compute(yes)

# Router.
class Routing extends canControl

    'route': ->
        showHeader yes

    'account/login route': ->
        showHeader no

# Render wrapping template.
class Layout extends canControl

    template: require './templates/layout'

    init: (el, options) ->
        @element.html can.view.mustache @template

# Header.
class Header extends canComponent
    
    tag: 'app-header'

    template: require './templates/header'

    init: ->
        # Change active menu link on URL change.
        can.route.bind 'change', (ev, attr, how, newURL, oldURL) =>
            @scope.menu.each (item) ->
                item.attr 'active', item.attr('url') is newURL

    scope: {
        showHeader: -> do showHeader
        account: -> do account
        menu: [
            { 'url': 'issue', 'label': 'Submit a new issue' }
            { 'url': 'account/signup', 'label': 'Signup' }
            { 'url': 'account/login', 'label': 'Login' }
        ]
    }

new Header()

module.exports = ->
    new Layout('body')

    new Routing()

    do can.route.ready