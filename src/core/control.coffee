class canControl

    constructor: (el, opts) ->
        # Create an object out of our properties.
        opts = {}
        ( opts[k] = v for k, v of @ when k isnt 'constructor' )
        
        Ctrl = can.Control opts
        new Ctrl el, opts

module.exports = canControl