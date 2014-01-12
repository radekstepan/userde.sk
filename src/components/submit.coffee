user     = require '../modules/user'
firebase = require '../modules/firebase'
github   = require '../modules/github'
results  = require '../modules/results'
state    = require '../modules/state'
Issue    = require '../modules/issue'

# The query.
query = null

# A counter of search requests as they are launched.
# Helps us determine if query results arrived too late.
request_id = 0

# Trigger a search.
search = (el, evt) ->
    # Focus our box.
    el.closest('.box').addClass 'focus'
    # Query matching any of the words.
    q = el.val().trim().split(/\s+/).join(' OR ')
    # Empty query? Just clear us.
    return results.replace [] unless q
    # The same as we already have?
    return if q is query
    query = q
    # Making a new request.
    our_id = ++request_id
    do (spinner = @element.find('.searching')).show
    github.search query, (err, res) ->
        do spinner.hide
        # If the input query has changed in the meantime
        #  ignore these results.
        return if our_id isnt request_id
        # Log errors.
        return mixpanel.track('error', {
            'where': 'github.search'
            'what':  do err.toString
        }) if err
        # Save the new results (or empty array).
        results.replace res.items

# Are we submitting an issue right now?
working = no

# Capture form errors here.
errors = new can.Map({ })

# Toggle and re-render the markup in body.
preview = (a, b, c) ->
    a.toggleClass 'closed eye eye-off'
    do b.toggle ; do c.toggle

    # Make sure preview is the same height.
    c.height do b.height

    # Render markdown.
    if c.is(':visible')
        c.html(marked(do b.val))
    # Focus on the input.
    else
        do b.focus

# Submit an issue form.
module.exports = can.Component.extend

    tag: 'app-submit'

    template: require '../templates/submit'

    scope: ->
        'user': { 'value': user }
        'errors': errors

    events:
        # Login.
        '.button.github click': ->
            firebase.login (err) ->
                throw err if err

        # Logout.
        '.logout click': ->
            do firebase.logout

        # Make a debounced search after 1s.
        '.input.title keyup': _.debounce search, 1e3

        # Make a search if we have content.
        '.input.title focus': search

        '.input.title focusout': (el) ->
            el.closest('.box').removeClass 'focus'

        # Submit the issue.
        '.button.primary.submit click': (el) ->
            done = ->
                working = no
                el.removeClass 'disabled'

            # Already running?
            return if working
            # Submitting.
            working = yes
            # Disable button.
            el.addClass 'disabled'

            # New instance.
            issue = new Issue()

            # Serialize the form.
            @element.find('.input').each (i, field) ->
                field = $ field
                key = field.data 'key'
                val = do field.val

                # Clear past errors for this field.
                errors.removeAttr key

                # Set the field on the issue.
                issue.attr key, val

            # Run the validators on the issue.
            for key, msg of do issue.errors
                # Save the error under `text` key.
                errors.attr key, _.map msg, (text) -> { text }

            # Do not continue if we have errors.
            return do done if can.Map.keys(errors).length

            # Submit the issue then.
            state.load 'Sending'
            mixpanel.track('submit')
            github.submit (do issue.attr), (err, res) ->
                do done
                return state.warn err if err
                # Success message.
                state.warn """
                Submitted as <a
                    class="link"
                    target="_blank"
                    href="#{res.html_url}"
                >##{res.number}</a>
                """
                # Redirect.
                setTimeout ->
                    window.location.replace res.html_url
                , 3e3

        # Auto-expand textarea.
        '.input.body keydown': (el) ->
            el.height ''
            el.height el.prop('scrollHeight') + 'px'

        # Toggle the preview.
        '.preview click': (el) ->
            b = @element.find('.input.body')
            c = @element.find('#preview')
            preview el, b, c

        '#preview dblclick': ->
            a = @element.find('.preview')
            b = @element.find('.input.body')
            c = @element.find('#preview')
            preview a, b, c