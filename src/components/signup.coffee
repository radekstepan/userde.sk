firebase   = require '../modules/firebase'
state      = require '../modules/state'
{ Signup } = require '../modules/forms'

# Are we submitting an application right now?
working = no

# Capture form errors here.
errors = new can.Map({ })

# Signup form.
module.exports = can.Component.extend

    tag: 'app-signup'

    template: require '../templates/signup'

    scope: -> { errors }

    events:
        # Submit the application.
        '.button.send click': (el, evt) ->
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
            signup = new Signup()

            # Serialize the form.
            @element.find('.input').each (i, field) ->
                field = $ field
                key = field.data 'key'
                val = do field.val

                # Clear past errors for this field.
                errors.removeAttr key

                # Set the field on the application.
                signup.attr key, val

            # Run the validators on the issue.
            for key, msg of do signup.errors
                # Save the error under `text` key.
                errors.attr key, _.map msg, (text) -> { text }

            # Do not continue if we have errors.
            return do done if can.Map.keys(errors).length

            # Submit the application then.
            state.load 'Sending'
            mixpanel.track 'signup'
            firebase.signup (do signup.attr), (err, res) ->
                do done
                if err
                    mixpanel.track('error', {
                        'where': 'firebase.signup'
                        'what':  text = do err.toString
                    })
                    state.warn text
                else
                    # Success message.
                    state.info 'Thank you for signing up! Will be in touch shortly.'