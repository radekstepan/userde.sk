user     = require '../modules/user'
firebase = require '../modules/firebase'
github   = require '../modules/github'
results  = require '../modules/results'

# A counter of requests as they are launched.
# Helps us determing if a query results arrived too late.
request_id = 0

# Trigger a search if our value changes.
search = can.compute ''
search.bind 'change', (ev, value) ->
    # Empty value? Just clear us.
    return results.replace [] unless value
    # Making a new request.
    our_id = ++request_id
    github.search value, (err, res) ->
        # If the input query has changed in the meantime
        #  ignore these results.
        return console.log('ignoring', value) if our_id isnt request_id
        # Ignore errors.
        return if err
        # Save the new results (or empty array).
        results.replace res.items

# Update input text.
input = (el, evt) ->
    # Focus our box.
    el.closest('.box').addClass 'focus'
    # Save new text.
    search do el.val

# Submit an issue form.
module.exports = can.Component.extend

    tag: 'app-submit'

    template: require '../templates/submit'

    scope: ->
        'user': { 'value': user }

    events:
        # Login.
        '.button.github click': ->
            firebase.login (err) ->
                throw err if err

        # Make a debounced search after 200ms.
        '.input.title keyup': _.debounce input, 2e2

        # Make a search if we have content.
        '.input.title focus': input

        '.input.title focusout': (el) ->
            el.closest('.box').removeClass 'focus'