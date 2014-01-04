state = require '../modules/state'

module.exports = can.Component.extend

    tag: 'app-notify'

    template: require '../templates/notify'

    scope: -> state

    helpers:
        # Show us?
        isVisible: (opts) ->
            if state.attr('type') is 'none'
                opts.inverse(@)
            else
                opts.fn(@)