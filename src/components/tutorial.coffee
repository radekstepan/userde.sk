options = require '../modules/options'

# App tutorial.
module.exports = can.Component.extend

    tag: 'app-tutorial'

    template: require '../templates/tutorial'

    scope: -> options