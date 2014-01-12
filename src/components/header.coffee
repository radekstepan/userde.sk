account  = require '../modules/account'
user     = require '../modules/user'
firebase = require '../modules/firebase'
layout   = require '../modules/layout'
options  = require '../modules/options'

# App header.
module.exports = can.Component.extend

    tag: 'app-header'

    template: require '../templates/header'

    scope: ->
        'account': { 'value': account }
        'user':    { 'value': user }
        'layout':  layout

    events:
        # Toggle account dropdown.
        '.icon.user click': (el, evt) ->
            layout.attr 'showAccountDropdown', not layout.showAccountDropdown
            do evt.preventDefault
            no

    helpers:
        # Fix the position of the dropdown.
        dropdownRight: (opts) ->
            do $('app-header .icon.user').outerWidth

        # Are we the admin user?
        isAdmin: (opts) ->
            if (usr = (do user).username) and usr is options.attr('admin')
                opts.fn(@)
            else
                opts.inverse(@)