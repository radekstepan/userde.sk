user     = require '../modules/user'
firebase = require '../modules/firebase'

# Submit an issue form.
module.exports = can.Component.extend

    tag: 'app-submit'

    template: require '../templates/submit'

    scope: ->
        'user': { 'value': user }

    events:
        '.button.github click': ->
            firebase.login (err) ->
                throw err if err