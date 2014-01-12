layout = require '../modules/layout'

# Layout.
module.exports = can.Component.extend

    tag: 'app-layout'

    events:
        # Hide account dropdown?
        'click': (el, evt) ->
            dropdown = @element.find('#account .dropdown')
            return if dropdown.is(evt.target) or dropdown.has(evt.target).length
            layout.attr 'showAccountDropdown', no