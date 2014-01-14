exports.Issue = can.Map.extend

    init: ->
        @validatePresenceOf [ 'title' ],
            'message': 'Field cannot be empty'

        @validatePresenceOf [ 'contact' ],
            'message': 'You need to connect with GitHub'

, {}

exports.Signup = can.Map.extend

    init: ->
        @validatePresenceOf [ 'username', 'email' ],
            'message': 'Field cannot be empty'

, {}