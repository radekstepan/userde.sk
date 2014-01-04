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
        '#account .logout click': ->
            do firebase.logout

        '#account click': ->
            do $('#account .dropdown').toggle