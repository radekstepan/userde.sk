class canComponent

    constructor: ->
        # Create an object out of our properties.
        opts = {}
        ( opts[k] = v for k, v of @ when k isnt 'constructor' )

        can.Component.extend opts

module.exports = canComponent