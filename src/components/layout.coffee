layout   = require '../modules/layout'
firebase = require '../modules/firebase'
options  = require '../modules/options'

# Layout.
module.exports = can.Component.extend

    tag: 'app-layout'

    scope: ->
        { options }

    events:
        # Hide account dropdown?
        'click': (el, evt) ->
            dropdown = @element.find('#account .dropdown')
            return if dropdown.is(evt.target) or dropdown.has(evt.target).length
            layout.attr 'showAccountDropdown', no

        # GitHub connect.
        '.button.github click': ->
            firebase.login (err) ->
                if err
                    # Log it.
                    mixpanel.track('error', {
                        'where': 'github.connect'
                        'what':  text = do err.toString
                    })
                    state.warn text

        # GitHub logout.
        '.logout click': ->
            do firebase.logout