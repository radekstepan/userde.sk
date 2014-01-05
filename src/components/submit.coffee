user     = require '../modules/user'
firebase = require '../modules/firebase'
github   = require '../modules/github'
results  = require '../modules/results'
state    = require '../modules/state'
Issue    = require '../modules/issue'

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
        return if our_id isnt request_id
        # Ignore errors.
        return if err
        # Save the new results (or empty array).
        results.replace res.items

# Update input text.
input = (el, evt) ->
    # Focus our box.
    el.closest('.box').addClass 'focus'
    # Save new text as a search query matching any of the words.
    search el.val().trim().split(/\s+/).join(' OR ')

# Are we submitting an issue right now?
working = no

# Capture form errors here.
errors = new can.Map({ })

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

        # Make a debounced search after 200ms.
        '.input.title keyup': _.debounce input, 2e2

        # Make a search if we have content.
        '.input.title focus': input

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
            el.toggleClass 'closed eye eye-off'
            do (a = @element.find('textarea.body')).toggle
            do (b = @element.find('#preview')).toggle

            # Make sure preview is the same height.
            b.height do a.height

            # Render markdown.
            b.html(marked(do a.val)) if b.is(':visible')