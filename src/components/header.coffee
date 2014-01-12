account  = require '../modules/account'
user     = require '../modules/user'
firebase = require '../modules/firebase'
layout   = require '../modules/layout'

# App header.
module.exports = can.Component.extend

    tag: 'app-header'

    template: require '../templates/header'

    scope: ->
        'account': { 'value': account }
        'user':    { 'value': user }
        'layout':  layout

    events:
        '#account .logout click': ->
            do firebase.logout

        # Toggle account dropdown.
        '#account .icon.user click': (el, evt) ->
            layout.attr 'showAccountDropdown', not layout.showAccountDropdown
            do evt.preventDefault
            no