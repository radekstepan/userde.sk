module.exports = can.Map.extend

    init: ->
        # Simple validator, will not check for "whitespace empty".
        @validatePresenceOf [ 'title' ],
            'message': 'Field cannot be empty'

        @validatePresenceOf [ 'contact' ],
            'message': 'You need to connect with GitHub'

, {}