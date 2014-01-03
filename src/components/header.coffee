account = require '../modules/account'

# App header.
module.exports = can.Component.extend

    tag: 'app-header'

    template: require '../templates/header'

    scope: ->
        'account': { 'value': account }