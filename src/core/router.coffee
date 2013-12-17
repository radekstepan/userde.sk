{ Backbone } = require './deps'

module.exports = ->
    router = new Backbone.Router
        routes: {
            'issues/new':    'issue'
            'account/new':   'signup'
            'account/login': 'login'
            '':              'index'
        }

        index: ->
            console.log '/'

        issue: ->
            console.log '/issue'

        signup: ->
            console.log '/signup'

        login: ->
            console.log '/login'

    do Backbone.history.start

    router