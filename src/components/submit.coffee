firebase = require '../modules/firebase'

# Submit an issue form.
module.exports = can.Component.extend

    tag: 'app-submit'

    template: require '../templates/submit'

    events:
        '.button.github click': ->
            firebase.login (err) ->
                throw err if err