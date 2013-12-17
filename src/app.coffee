{ Ember } = require './core/deps'

module.exports = ->
    App = do Ember.Application.create

    App.Router.map ->
        @resource('index', { path: '/' })