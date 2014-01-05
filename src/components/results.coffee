results = require '../modules/results'

module.exports = can.Component.extend

    tag: 'app-results'

    template: require '../templates/results'

    scope: ->
        { results }