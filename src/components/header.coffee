account  = require '../modules/account'
user     = require '../modules/user'
firebase = require '../modules/firebase'

# App header.
module.exports = can.Component.extend

    tag: 'app-header'

    template: require '../templates/header'

    scope: ->
        'account': { 'value': account }
        'user':    { 'value': user }

    events:
        '.link.logout click': firebase.logout