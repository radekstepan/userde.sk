canControl   = require './core/control'
canComponent = require './core/component'

class Header extends canComponent

    # Specifies the HTML element that components are created on.
    tag: 'app-header'
    
    # A template who's content gets inserted within the component's
    #  element.
    template: require './templates/header'

    # Describes a can.Map that is added to the scope used to render
    #  the component's template.
    scope:
        # The main menu links.
        menu: ->
            [
                { 'name': 'Submit a new issue' }
                { 'name': 'Signup' }
                { 'name': 'Login' }
            ]

        # Hide on some pages.
        visible: yes
    
    # Local mustache helpers available within the component's
    #  template.
    helpers:
        # Make a link.
        link: (name) -> can.route.link(name, {})

module.exports = ->
    can.route 'account/login'

    do can.route.ready

    new Header '#header'