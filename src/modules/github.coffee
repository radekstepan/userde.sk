# GitHub repo.
account = require './account'
# User account.
user    = require './user'

# Custom JSON parser.
superagent.parse =
    'application/json': (res) ->
        try
            JSON.parse res
        catch e
            {} # it was not to be...

module.exports =

    # Issues search.
    'search': (text, cb) ->       
        request
            'protocol':  'https'
            'host':      'api.github.com'
            'path':      "/search/issues"
            'query':
                'q':     "#{text}+repo:#{do account}"
                'sort':  'updated'
                'order': 'desc'
            'headers':   do headers
        , cb

# Make a request using SuperAgent.
request = ({ protocol, host, path, query, headers }, cb) ->
    exited = no

    # Make the query params.
    q = if query then '?' + ( "#{k}=#{v}" for k, v of query ).join('&') else ''

    # The URI.
    req = superagent.get("#{protocol}://#{host}#{path}#{q}")
    # Add headers.
    ( req.set(k, v) for k, v of headers )
    
    # Timeout for requests that do not finish... see #32.
    timeout = setTimeout ->
        exited = yes
        cb 'Request has timed out'
    , 1e4 # give us 10s

    # Send.
    req.end (err, data) ->
        # Arrived too late.
        return if exited
        # All fine.
        exited = yes
        clearTimeout timeout
        # Actually process the response.
        response err, data, cb

# How do we respond to a response?
response = (err, data, cb) ->
    return cb error err if err
    # 2xx?
    if data.statusType isnt 2
        # Do we have a message from GitHub?
        return cb data.body.message if data?.body?.message?
        # Use SA one.
        return cb data.error.message
    # All good.
    cb null, data.body

# Give us headers.
headers = ->
    # The defaults.
    h = _.extend {},
        'Content-Type': 'application/json'
        'Accept': 'application/vnd.github.v3'
    # Add token?
    h.Authorization = "token #{token}" if token = (do user).accessToken
    h

# Parse an error.
error = (err) ->
    switch
        when _.isString err
            message = err
        when _.isArray err
            message = err[1]
        when _.isObject(err) and _.isString(err.message)
            message = err.message

    unless message
        try
            message = JSON.stringify err
        catch
            message = do err.toString

    message