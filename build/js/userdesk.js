(function() {
  /**
   * Require the given path.
   *
   * @param {String} path
   * @return {Object} exports
   * @api public
   */
  var require = function(path, parent, orig) {
    var resolved = require.resolve(path);

    // lookup failed
    if (null === resolved) {
      orig = orig || path;
      parent = parent || 'root';
      var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
      err.path = orig;
      err.parent = parent;
      err.require = true;
      throw err;
    }

    var module = require.modules[resolved];

    // perform real require()
    // by invoking the module's
    // registered function
    if (!module._resolving && !module.exports) {
      var mod = {};
      mod.exports = {};
      mod.client = mod.component = true;
      module._resolving = true;
      module.call(this, mod.exports, require.relative(resolved), mod);
      delete module._resolving;
      module.exports = mod.exports;
    }

    return module.exports;
  };

  /**
   * Registered modules.
   */

  require.modules = {};

  /**
   * Registered aliases.
   */

  require.aliases = {};

  /**
   * Resolve `path`.
   *
   * Lookup:
   *
   *   - PATH/index.js
   *   - PATH.js
   *   - PATH
   *
   * @param {String} path
   * @return {String} path or null
   * @api private
   */

  require.resolve = function(path) {
    if (path.charAt(0) === '/') path = path.slice(1);

    var paths = [
      path,
      path + '.js',
      path + '.json',
      path + '/index.js',
      path + '/index.json'
    ];

    for (var i = 0; i < paths.length; i++) {
      path = paths[i];
      if (require.modules.hasOwnProperty(path)) return path;
      if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
    }
  };

  /**
   * Normalize `path` relative to the current path.
   *
   * @param {String} curr
   * @param {String} path
   * @return {String}
   * @api private
   */

  require.normalize = function(curr, path) {
    var segs = [];

    if ('.' != path.charAt(0)) return path;

    curr = curr.split('/');
    path = path.split('/');

    for (var i = 0; i < path.length; ++i) {
      if ('..' == path[i]) {
        curr.pop();
      } else if ('.' !== path[i] && '' !== path[i]) {
        segs.push(path[i]);
      }
    }

    return curr.concat(segs).join('/');
  };

  /**
   * Register module at `path` with callback `definition`.
   *
   * @param {String} path
   * @param {Function} definition
   * @api private
   */

  require.register = function(path, definition) {
    require.modules[path] = definition;
  };

  /**
   * Alias a module definition.
   *
   * @param {String} from
   * @param {String} to
   * @api private
   */

  require.alias = function(from, to) {
    if (!require.modules.hasOwnProperty(from)) {
      throw new Error('Failed to alias "' + from + '", it does not exist');
    }
    require.aliases[to] = from;
  };

  /**
   * Return a require function relative to the `parent` path.
   *
   * @param {String} parent
   * @return {Function}
   * @api private
   */

  require.relative = function(parent) {
    var p = require.normalize(parent, '..');

    /**
     * lastIndexOf helper.
     */

    function lastIndexOf(arr, obj) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === obj) return i;
      }
      return -1;
    }

    /**
     * The relative require() itself.
     */

    var localRequire = function(path) {
      var resolved = localRequire.resolve(path);
      return require(resolved, parent, path);
    };

    /**
     * Resolve relative to the parent.
     */

    localRequire.resolve = function(path) {
      var c = path.charAt(0);
      if ('/' == c) return path.slice(1);
      if ('.' == c) return require.normalize(p, path);

      // resolve deps by returning
      // the dep in the nearest "deps"
      // directory
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    };

    /**
     * Check if module is defined at `path`.
     */
    localRequire.exists = function(path) {
      return require.modules.hasOwnProperty(localRequire.resolve(path));
    };

    return localRequire;
  };

  // Global on server, window in browser.
  var root = this;

  // Do we already have require loader?
  root.require = (typeof root.require !== 'undefined') ? root.require : require;

  // All our modules will use global require.
  (function() {
    
    
    // app.coffee
    root.require.register('userde.sk/src/app.js', function(exports, require, module) {
    
      var Routing, account, firebase, github, load, options, render, state, user;
      
      firebase = require('./modules/firebase');
      
      user = require('./modules/user');
      
      account = require('./modules/account');
      
      render = require('./modules/render');
      
      state = require('./modules/state');
      
      github = require('./modules/github');
      
      options = require('./modules/options');
      
      load = ['modules/helpers', 'components/error', 'components/header', 'components/layout', 'components/notify', 'components/result', 'components/results', 'components/signup', 'components/submit', 'components/tutorial'];
      
      Routing = can.Control({
        init: function() {
          var path, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = load.length; _i < _len; _i++) {
            path = load[_i];
            _results.push(require("./" + path));
          }
          return _results;
        },
        route: function() {
          var template;
          template = require('./templates/page/index');
          return this.render(template);
        },
        ':owner/:repo route': function(data) {
          var template;
          account("" + data.owner + "/" + data.repo);
          mixpanel.track('account', data);
          template = require('./templates/page/submit');
          return this.render(template, {}, 'Submit an issue');
        },
        'signup route': function() {
          var template;
          template = require('./templates/page/signup');
          return this.render(template);
        },
        'login route': function() {
          var template;
          template = require('./templates/page/login');
          return this.render(template);
        },
        render: function(template, ctx, title) {
          if (ctx == null) {
            ctx = {};
          }
          this.element.html(render(template, ctx));
          return document.title = title ? "" + title + " - userde.sk" : 'userde.sk';
        }
      });
      
      module.exports = function(opts) {
        firebase.attr('client', opts.firebase);
        mixpanel.init(opts.mixpanel);
        options.attr(opts, false);
        new Routing(opts.el);
        return can.route.ready();
      };
      
    });

    
    // error.coffee
    root.require.register('userde.sk/src/components/error.js', function(exports, require, module) {
    
      module.exports = can.Component.extend({
        tag: 'app-error',
        template: require('../templates/error')
      });
      
    });

    
    // header.coffee
    root.require.register('userde.sk/src/components/header.js', function(exports, require, module) {
    
      var account, firebase, layout, options, user;
      
      account = require('../modules/account');
      
      user = require('../modules/user');
      
      firebase = require('../modules/firebase');
      
      layout = require('../modules/layout');
      
      options = require('../modules/options');
      
      module.exports = can.Component.extend({
        tag: 'app-header',
        template: require('../templates/header'),
        scope: function() {
          return {
            'account': {
              'value': account
            },
            'user': {
              'value': user
            },
            'layout': layout
          };
        },
        events: {
          '.icon.user click': function(el, evt) {
            layout.attr('showAccountDropdown', !layout.showAccountDropdown);
            evt.preventDefault();
            return false;
          }
        },
        helpers: {
          dropdownRight: function(opts) {
            return $('app-header .icon.user').outerWidth();
          },
          isAdmin: function(opts) {
            var usr;
            if ((usr = (user()).username) && usr === options.attr('admin')) {
              return opts.fn(this);
            } else {
              return opts.inverse(this);
            }
          }
        }
      });
      
    });

    
    // layout.coffee
    root.require.register('userde.sk/src/components/layout.js', function(exports, require, module) {
    
      var firebase, layout, options;
      
      layout = require('../modules/layout');
      
      firebase = require('../modules/firebase');
      
      options = require('../modules/options');
      
      module.exports = can.Component.extend({
        tag: 'app-layout',
        scope: function() {
          return {
            options: options
          };
        },
        events: {
          'click': function(el, evt) {
            var dropdown;
            dropdown = this.element.find('#account .dropdown');
            if (dropdown.is(evt.target) || dropdown.has(evt.target).length) {
              return;
            }
            return layout.attr('showAccountDropdown', false);
          },
          '.button.github click': function() {
            return firebase.login(function(err) {
              var text;
              if (err) {
                mixpanel.track('error', {
                  'where': 'github.connect',
                  'what': text = err.toString()
                });
                return state.warn(text);
              }
            });
          },
          '.logout click': function() {
            return firebase.logout();
          }
        }
      });
      
    });

    
    // notify.coffee
    root.require.register('userde.sk/src/components/notify.js', function(exports, require, module) {
    
      var state;
      
      state = require('../modules/state');
      
      module.exports = can.Component.extend({
        tag: 'app-notify',
        template: require('../templates/notify'),
        scope: function() {
          return state;
        },
        helpers: {
          isVisible: function(opts) {
            if (state.attr('type') === 'none') {
              return opts.inverse(this);
            } else {
              return opts.fn(this);
            }
          }
        }
      });
      
    });

    
    // result.coffee
    root.require.register('userde.sk/src/components/result.js', function(exports, require, module) {
    
      module.exports = can.Component.extend({
        tag: 'app-result',
        template: require('../templates/result')
      });
      
    });

    
    // results.coffee
    root.require.register('userde.sk/src/components/results.js', function(exports, require, module) {
    
      var results;
      
      results = require('../modules/results');
      
      module.exports = can.Component.extend({
        tag: 'app-results',
        template: require('../templates/results'),
        scope: function() {
          return {
            results: results
          };
        }
      });
      
    });

    
    // signup.coffee
    root.require.register('userde.sk/src/components/signup.js', function(exports, require, module) {
    
      var Signup, errors, firebase, state, working;
      
      firebase = require('../modules/firebase');
      
      state = require('../modules/state');
      
      Signup = require('../modules/forms').Signup;
      
      working = false;
      
      errors = new can.Map({});
      
      module.exports = can.Component.extend({
        tag: 'app-signup',
        template: require('../templates/signup'),
        scope: function() {
          return {
            errors: errors
          };
        },
        events: {
          '.button.send click': function(el, evt) {
            var done, key, msg, signup, _ref;
            done = function() {
              working = false;
              return el.removeClass('disabled');
            };
            if (working) {
              return;
            }
            working = true;
            el.addClass('disabled');
            signup = new Signup();
            this.element.find('.input').each(function(i, field) {
              var key, val;
              field = $(field);
              key = field.data('key');
              val = field.val();
              errors.removeAttr(key);
              return signup.attr(key, val);
            });
            _ref = signup.errors();
            for (key in _ref) {
              msg = _ref[key];
              errors.attr(key, _.map(msg, function(text) {
                return {
                  text: text
                };
              }));
            }
            if (can.Map.keys(errors).length) {
              return done();
            }
            state.load('Sending');
            mixpanel.track('signup');
            return firebase.signup(signup.attr(), function(err, res) {
              var text;
              done();
              if (err) {
                mixpanel.track('error', {
                  'where': 'firebase.signup',
                  'what': text = err.toString()
                });
                return state.warn(text);
              } else {
                return state.info('Thank you for signing up! Will be in touch shortly.');
              }
            });
          }
        }
      });
      
    });

    
    // submit.coffee
    root.require.register('userde.sk/src/components/submit.js', function(exports, require, module) {
    
      var Issue, errors, github, preview, query, request_id, results, search, state, user, working;
      
      user = require('../modules/user');
      
      github = require('../modules/github');
      
      results = require('../modules/results');
      
      state = require('../modules/state');
      
      Issue = require('../modules/forms').Issue;
      
      query = null;
      
      request_id = 0;
      
      search = function(el, evt) {
        var our_id, q, spinner;
        el.closest('.box').addClass('focus');
        q = el.val().trim().split(/\s+/).join(' OR ');
        if (!q) {
          return results.replace([]);
        }
        if (q === query) {
          return;
        }
        query = q;
        our_id = ++request_id;
        (spinner = this.element.find('.searching')).show();
        return github.search(query, function(err, res) {
          spinner.hide();
          if (our_id !== request_id) {
            return;
          }
          if (err) {
            return mixpanel.track('error', {
              'where': 'github.search',
              'what': err.toString()
            });
          }
          return results.replace(res.items);
        });
      };
      
      working = false;
      
      errors = new can.Map({});
      
      preview = function(a, b, c) {
        a.toggleClass('closed eye eye-off');
        b.toggle();
        c.toggle();
        c.height(b.height());
        if (c.is(':visible')) {
          return c.html(marked(b.val()));
        } else {
          return b.focus();
        }
      };
      
      module.exports = can.Component.extend({
        tag: 'app-submit',
        template: require('../templates/submit'),
        scope: function() {
          return {
            'user': {
              'value': user
            },
            'errors': errors
          };
        },
        events: {
          '.input.title keyup': _.debounce(search, 1e3),
          '.input.title focus': search,
          '.input.title focusout': function(el) {
            return el.closest('.box').removeClass('focus');
          },
          '.button.primary.submit click': function(el) {
            var done, issue, key, msg, _ref;
            done = function() {
              working = false;
              return el.removeClass('disabled');
            };
            if (working) {
              return;
            }
            working = true;
            el.addClass('disabled');
            issue = new Issue();
            this.element.find('.input').each(function(i, field) {
              var key, val;
              field = $(field);
              key = field.data('key');
              val = field.val();
              errors.removeAttr(key);
              return issue.attr(key, val);
            });
            _ref = issue.errors();
            for (key in _ref) {
              msg = _ref[key];
              errors.attr(key, _.map(msg, function(text) {
                return {
                  text: text
                };
              }));
            }
            if (can.Map.keys(errors).length) {
              return done();
            }
            state.load('Sending');
            mixpanel.track('submit');
            return github.submit(issue.attr(), function(err, res) {
              var text;
              done();
              if (err) {
                mixpanel.track('error', {
                  'where': 'github.submit',
                  'what': text = err.toString()
                });
                return state.warn(text);
              } else {
                state.info("Submitted as <a\n    class=\"link\"\n    target=\"_blank\"\n    href=\"" + res.html_url + "\"\n>#" + res.number + "</a>");
                return setTimeout(function() {
                  return window.location.replace(res.html_url);
                }, 3e3);
              }
            });
          },
          '.input.body keydown': function(el) {
            el.height('');
            return el.height(el.prop('scrollHeight') + 'px');
          },
          '.preview click': function(el) {
            var b, c;
            b = this.element.find('.input.body');
            c = this.element.find('#preview');
            return preview(el, b, c);
          },
          '#preview dblclick': function() {
            var a, b, c;
            a = this.element.find('.preview');
            b = this.element.find('.input.body');
            c = this.element.find('#preview');
            return preview(a, b, c);
          }
        }
      });
      
    });

    
    // tutorial.coffee
    root.require.register('userde.sk/src/components/tutorial.js', function(exports, require, module) {
    
      var options;
      
      options = require('../modules/options');
      
      module.exports = can.Component.extend({
        tag: 'app-tutorial',
        template: require('../templates/tutorial'),
        scope: function() {
          return options;
        },
        events: {
          '.icon.close click': function() {
            return options.attr('showTutorial', false);
          }
        }
      });
      
    });

    
    // account.coffee
    root.require.register('userde.sk/src/modules/account.js', function(exports, require, module) {
    
      module.exports = can.compute('');
      
    });

    
    // firebase.coffee
    root.require.register('userde.sk/src/modules/firebase.js', function(exports, require, module) {
    
      var authCb, state, user;
      
      user = require('./user');
      
      state = require('../modules/state');
      
      authCb = function() {};
      
      module.exports = new can.Map({
        setClient: function(root, success, error) {
          var client;
          client = new Firebase("https://" + root + ".firebaseio.com");
          state.load('Loading');
          this.attr('auth', new FirebaseSimpleLogin(client, function(err, obj) {
            if (err || !obj) {
              if (!obj) {
                state.none();
              }
              return authCb(err);
            }
            user(obj);
            state.info("" + obj.displayName + " is logged in");
            return authCb();
          }));
          return client;
        },
        login: function(cb, provider) {
          if (provider == null) {
            provider = 'github';
          }
          if (!this.client) {
            return cb('Client is not setup');
          }
          authCb = cb;
          state.load('Connecting GitHub account');
          return this.auth.login(provider, {
            'rememberMe': true,
            'scope': 'public_repo'
          });
        },
        logout: function() {
          var _ref;
          if ((_ref = this.auth) != null) {
            _ref.logout();
          }
          user({});
          return state.info('You have logged out');
        },
        signup: function(data, cb) {
          console.log(data);
          return cb(null);
        }
      });
      
    });

    
    // forms.coffee
    root.require.register('userde.sk/src/modules/forms.js', function(exports, require, module) {
    
      exports.Issue = can.Map.extend({
        init: function() {
          this.validatePresenceOf(['title'], {
            'message': 'Field cannot be empty'
          });
          return this.validatePresenceOf(['contact'], {
            'message': 'You need to connect with GitHub'
          });
        }
      }, {});
      
      exports.Signup = can.Map.extend({
        init: function() {
          return this.validatePresenceOf(['username', 'email'], {
            'message': 'Field cannot be empty'
          });
        }
      }, {});
      
    });

    
    // github.coffee
    root.require.register('userde.sk/src/modules/github.js', function(exports, require, module) {
    
      var account, error, headers, request, response, user;
      
      account = require('./account');
      
      user = require('./user');
      
      superagent.parse = {
        'application/json': function(res) {
          var e;
          try {
            return JSON.parse(res);
          } catch (_error) {
            e = _error;
            return {};
          }
        }
      };
      
      module.exports = {
        'search': function(text, cb) {
          return request({
            'path': "/search/issues",
            'query': {
              'q': "" + text + "+repo:" + (account()),
              'sort': 'updated',
              'order': 'desc'
            },
            'headers': headers()
          }, cb);
        },
        'submit': function(body, cb) {
          return request({
            'method': 'post',
            'path': "/repos/" + (account()) + "/issues",
            'headers': headers(),
            'body': body
          }, cb);
        },
        'exists': function(cb) {
          return request({
            'path': "/repos/" + (account()),
            'headers': headers()
          }, cb);
        }
      };
      
      request = function(_arg, cb) {
        var body, exited, headers, host, k, method, path, protocol, q, query, req, timeout, v;
        method = _arg.method, protocol = _arg.protocol, host = _arg.host, path = _arg.path, query = _arg.query, headers = _arg.headers, body = _arg.body;
        exited = false;
        if (method == null) {
          method = 'get';
        }
        q = query ? '?' + ((function() {
          var _results;
          _results = [];
          for (k in query) {
            v = query[k];
            _results.push("" + k + "=" + v);
          }
          return _results;
        })()).join('&') : '';
        req = superagent[method]("https://api.github.com" + path + q);
        for (k in headers) {
          v = headers[k];
          req.set(k, v);
        }
        if (body) {
          req.send(body);
        }
        timeout = setTimeout(function() {
          exited = true;
          return cb('Request has timed out');
        }, 1e4);
        return req.end(function(err, data) {
          if (exited) {
            return;
          }
          exited = true;
          clearTimeout(timeout);
          return response(err, data, cb);
        });
      };
      
      response = function(err, data, cb) {
        var _ref;
        if (err) {
          return cb(error(err));
        }
        if (data.statusType !== 2) {
          if ((data != null ? (_ref = data.body) != null ? _ref.message : void 0 : void 0) != null) {
            return cb(data.body.message);
          }
          return cb(data.error.message);
        }
        return cb(null, data.body);
      };
      
      headers = function() {
        var h, token;
        h = _.extend({}, {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3'
        });
        if (token = (user()).accessToken) {
          h.Authorization = "token " + token;
        }
        return h;
      };
      
      error = function(err) {
        var message;
        switch (false) {
          case !_.isString(err):
            message = err;
            break;
          case !_.isArray(err):
            message = err[1];
            break;
          case !(_.isObject(err) && _.isString(err.message)):
            message = err.message;
        }
        if (!message) {
          try {
            message = JSON.stringify(err);
          } catch (_error) {
            message = err.toString();
          }
        }
        return message;
      };
      
    });

    
    // helpers.coffee
    root.require.register('userde.sk/src/modules/helpers.js', function(exports, require, module) {
    
      var ago, avatar, isLoggedIn, user;
      
      user = require('./user');
      
      exports.isLoggedIn = isLoggedIn = function(opts) {
        if (_.has(user(), 'username')) {
          return opts.fn(this);
        } else {
          return opts.inverse(this);
        }
      };
      
      exports.ago = ago = function(time, opts) {
        return moment(time()).fromNow();
      };
      
      exports.avatar = avatar = function(size) {
        var url;
        if (size == null) {
          size = 40;
        }
        url = (user()).avatar_url + ("&s=" + size);
        return can.Mustache.safeString("<img src='" + url + "'>");
      };
      
      Mustache.registerHelper('isLoggedIn', isLoggedIn);
      
      Mustache.registerHelper('ago', ago);
      
      Mustache.registerHelper('avatar', avatar);
      
    });

    
    // layout.coffee
    root.require.register('userde.sk/src/modules/layout.js', function(exports, require, module) {
    
      module.exports = new can.Map({
        'showAccountDropdown': false
      });
      
    });

    
    // options.coffee
    root.require.register('userde.sk/src/modules/options.js', function(exports, require, module) {
    
      module.exports = new can.Map({
        'showTutorial': true
      });
      
    });

    
    // render.coffee
    root.require.register('userde.sk/src/modules/render.js', function(exports, require, module) {
    
      module.exports = function(template, ctx) {
        if (ctx == null) {
          ctx = {};
        }
        return can.view.mustache(template)(ctx);
      };
      
    });

    
    // results.coffee
    root.require.register('userde.sk/src/modules/results.js', function(exports, require, module) {
    
      module.exports = new can.List([]);
      
    });

    
    // state.coffee
    root.require.register('userde.sk/src/modules/state.js', function(exports, require, module) {
    
      var State, ms, timeout, update;
      
      ms = 3e3;
      
      update = function(text, type) {
        switch (type) {
          case 'load':
            text += '<span class="icon spin6"></span>';
        }
        return this.attr('text', text).attr('type', type);
      };
      
      module.exports = State = new can.Map({
        text: null,
        type: 'none',
        load: _.partialRight(update, 'load'),
        info: _.partialRight(update, 'info'),
        warn: _.partialRight(update, 'warn'),
        none: function() {
          return this.attr('type', 'none');
        }
      });
      
      timeout = null;
      
      State.bind('type', function(ev, newVal, oldVal) {
        var _this = this;
        clearTimeout(timeout);
        if (newVal === 'warn' || newVal === 'load') {
          return;
        }
        return setTimeout(function() {
          return _this.attr('type', 'none');
        }, ms);
      });
      
    });

    
    // user.coffee
    root.require.register('userde.sk/src/modules/user.js', function(exports, require, module) {
    
      var user;
      
      module.exports = user = can.compute({});
      
      user.bind('change', function(ev, obj) {
        mixpanel.people.set({
          '$email': obj.email,
          'name': obj.displayName
        });
        return mixpanel.identify(obj.username);
      });
      
    });

    
    // error.mustache
    root.require.register('userde.sk/src/templates/error.js', function(exports, require, module) {
    
      module.exports = ["<span class=\"error message\">{{ text }}.</span>"].join("\n");
    });

    
    // header.mustache
    root.require.register('userde.sk/src/templates/header.js', function(exports, require, module) {
    
      module.exports = ["<div id=\"header\">","    <div class=\"wrapper\">","        <div id=\"account\">","        {{ #isLoggedIn }}","            <a class=\"icon user\">{{ user.value.displayName }}</a>","            {{ #if layout.showAccountDropdown }}","            <div class=\"dropdown\" style=\"right:{{ dropdownRight }}px\">","                <div class=\"section profile\">","                    <div class=\"avatar\">","                        <!--<div class=\"icon user\"></div>-->","                        {{ avatar 40 }}","                    </div>","                    <div class=\"email\">","                        {{ user.value.email }}","                    </div>","                    <a class=\"primary button small settings\">Settings</a>","                </div>","                <ul class=\"section menu\">","                {{ #isAdmin }}","                    <li><a target=\"mixpanel\" href=\"https://mixpanel.com/report/339487/\">Analytics</a></li>","                {{ /isAdmin }}","                    <li><a class=\"logout\">Logout</a></li>","                </ul>","            </div>","            {{ /if }}","        {{ else }}","            <div class=\"icon button secondary small github\">Connect with GitHub</div>","        {{ /isLoggedIn }}","        </div>","        <div id=\"title\">userde.sk@{{ account.value }}</div>","        <div id=\"menu\">","            <!--","            <ul>","                <li>","                    <a href=\"#\">Link</a>","                </li>","            </ul>","            -->","        </div>","    </div>","</div>"].join("\n");
    });

    
    // notify.mustache
    root.require.register('userde.sk/src/templates/notify.js', function(exports, require, module) {
    
      module.exports = ["{{ #isVisible }}","<div id=\"notify\" class=\"{{ type }}\">","    <div class=\"message\">","        <div class=\"wrapper\">","            <div class=\"content\">","                {{{ text }}}","            </div>","        </div>","    </div>","</div>","{{ /isVisible }}"].join("\n");
    });

    
    // index.mustache
    root.require.register('userde.sk/src/templates/page/index.js', function(exports, require, module) {
    
      module.exports = ["<app-layout class=\"index\">","    <div id=\"hero\">","        <h1 class=\"title\">userde.sk</h1>","        <p class=\"subtitle\">Your better customer support with GitHub Issues.</p>","        <div class=\"buttons\">","            <a href=\"#!signup\" class=\"button large primary signup\">Signup</a>","            <div class=\"button large secondary icon github\">Connect with GitHub</div>","        </div>","    </div>","</app-layout>"].join("\n");
    });

    
    // login.mustache
    root.require.register('userde.sk/src/templates/page/login.js', function(exports, require, module) {
    
      module.exports = ["<app-layout class=\"app box\">","    <div id=\"promo\" class=\"login box\">","        <div class=\"left\">","            <div class=\"title\">userde.sk</div>","            <a class=\"link bottom\">About the service</a>","        </div>","","        <div class=\"right\">","            <div class=\"header\">","                <h1>Account Login</h1>","            </div>","            ","            <div class=\"button primary\">Login using GitHub</div>","            ","            <div class=\"bottom\">","                <a class=\"link\">New account</a>","                <a class=\"link\">Login problems?</a>","            </div>","        </div>","    </div>","</app-layout>"].join("\n");
    });

    
    // signup.mustache
    root.require.register('userde.sk/src/templates/page/signup.js', function(exports, require, module) {
    
      module.exports = ["<app-layout class=\"app box\">","    <div id=\"promo\" class=\"signup box\">","        <div class=\"left\">","            <div class=\"title\">userde.sk</div>","            <a class=\"link bottom\">About the service</a>","        </div>","","        <div class=\"right\">","            <div class=\"header\">","                <h1>Signup</h1>","            </div>","            ","            <app-signup></app-signup>","","            <div class=\"bottom\">","                <a class=\"link\">Check application status</a>","            </div>","        </div>","    </div>","</app-layout>"].join("\n");
    });

    
    // submit.mustache
    root.require.register('userde.sk/src/templates/page/submit.js', function(exports, require, module) {
    
      module.exports = ["<app-layout class=\"app\">","    <app-notify></app-notify>","    <app-tutorial></app-tutorial>","    <div id=\"main\" {{ #options.showTutorial }}class=\"tutorial\"{{ /options.showTutorial }}>","        <app-header></app-header>","        <app-submit></app-submit>","    </div>","</app-layout>"].join("\n");
    });

    
    // result.mustache
    root.require.register('userde.sk/src/templates/result.js', function(exports, require, module) {
    
      module.exports = ["{{ #closed_at }}","<span class=\"tag closed\">closed</span>","{{ /closed_at }}","","<a target=\"issue_{{ number }}\" href=\"{{ html_url }}\" class=\"link\">{{ title }}</a>","","<span class=\"ago\">{{ ago updated_at }}</span>"].join("\n");
    });

    
    // results.mustache
    root.require.register('userde.sk/src/templates/results.js', function(exports, require, module) {
    
      module.exports = ["{{ #if results.length }}","<div id=\"results\">","    <ul>","        {{ #results }}","        <li><app-result></app-result></li>","        {{ /results }}","    </ul>","</div>","{{ /if }}"].join("\n");
    });

    
    // signup.mustache
    root.require.register('userde.sk/src/templates/signup.js', function(exports, require, module) {
    
      module.exports = ["<div class=\"form\">","    <div class=\"box\">","        <div class=\"field\">","            <h3>1. GitHub Username</h3>","            <input","                class=\"input {{ #if errors.username.length }}error{{ /if }}\"","                type=\"text\"","                data-key=\"username\"","                placeholder=\"Type your username here\"","                autofocus","            />","            {{ #errors.username }}","            <app-error></app-error>","            {{ /errors.username }}","        </div>","    </div>","    ","    <div class=\"box\">","        <div class=\"field\">","            <h3>2. Contact</h3>","            <label>Provide an email so that we can contact you when your account is ready.</label>","            <input","                class=\"input {{ #if errors.email.length }}error{{ /if }}\"","                type=\"text\"","                data-key=\"email\"","                placeholder=\"Email address\"","            />","            {{ #errors.email }}","            <app-error></app-error>","            {{ /errors.email }}","        </div>","    </div>","","    <div class=\"box\">","        <div class=\"field\">","            <h3>3. Message (optional)</h3>","            <label>Do you have a special request? Anything we should know?</label>","            <textarea class=\"input\" rows=4 data-key=\"message\"></textarea>","        </div>","    </div>","</div>","","<div class=\"button primary send\">Send</div>"].join("\n");
    });

    
    // submit.mustache
    root.require.register('userde.sk/src/templates/submit.js', function(exports, require, module) {
    
      module.exports = ["<div id=\"content\" class=\"box\">","    <div class=\"header\">","        <h2>How can we help?</h2>","        <p>Send us bugs you have encountered or suggestions.</p>","    </div>","","    <div class=\"form\">","        <div class=\"box\">","            <div class=\"field\">","                <h3>1. Title</h3>","                <label>What question would you like to ask?</label>","                {{ #errors.title }}","                <app-error></app-error>","                {{ /errors.title }}","                <span class=\"searching icon spin6\"></span>","                <input","                    class=\"input title {{ #if errors.title.length }}error{{ /if }}\"","                    data-key=\"title\"","                    type=\"text\"","                    placeholder=\"Type your question here\"","                    autofocus","                />","            </div>","            <app-results></app-results>","        </div>","","        <div class=\"box\">","            <div class=\"field\">","                <h3>2. Description</h3>","                <div>","                    <span class=\"icon eye preview closed\"></span>","                    <label>Describe the question you are asking. You can use <a target=\"_blank\" href=\"https://help.github.com/articles/github-flavored-markdown\" class=\"link\">GitHub Flavored Markdown</a>.</label>","                </div>","                {{ #errors.body }}","                <app-error></app-error>","                {{ /errors.body }}","                <textarea","                    class=\"input body {{ #if errors.body.length }}error{{ /if }}\"","                    data-key=\"body\"","                    placeholder=\"Make it simple and easy to understand\"","                ></textarea>","                <div id=\"preview\"></div>","            </div>","        </div>","","        <div class=\"box\">","            <div class=\"field\">","                <h3>3. Contact</h3>","                {{ #isLoggedIn }}","                    Connected as {{ user.value.displayName }}. <a class=\"link logout\">Logout</a>","                    <input","                        type=\"hidden\"","                        class=\"input contact\"","                        data-key=\"contact\"","                        value=\"{{ user.value.email }}\"","                    />","                {{ else }}","                <!--","                    <label>Provide either an email or connect with <a class=\"link\">GitHub</a>.</label>","                    <div class=\"half first\">","                        <input class=\"input\" type=\"text\" placeholder=\"Email address\" />","                    </div>","                    <div class=\"half second\">","                        <div class=\"button github\">Connect with GitHub</div>","                    </div>","                -->","                    <label>Connect with <a class=\"link\">GitHub</a>. Only your public profile is accessed.</label>","                    <div class=\"icon button secondary github\">Connect with GitHub</div>","                    {{ #errors.contact }}","                    <app-error></app-error>","                    {{ /errors.contact }}","                {{ /isLoggedIn }}","            </div>","        </div>","    </div>","","    <div class=\"footer\">","        <div class=\"button primary submit\">Finish</div>","    </div>","</div>"].join("\n");
    });

    
    // tutorial.mustache
    root.require.register('userde.sk/src/templates/tutorial.js', function(exports, require, module) {
    
      module.exports = ["{{ #showTutorial }}","<div id=\"tutorial\">","    <div class=\"head\">","        <span class=\"icon cancel-circled-outline close\"></span> <h2>Tutorial</h2>","    </div>","    <div class=\"step active\">","        <h3><span class=\"number\">1</span> Submit an issue</h3>","        <p>Bacon ipsum dolor sit amet rump fatback ground round, tail pork chop chuck beef andouille biltong corned beef. Frankfurter <a href=\"#\">flank pork</a>, meatloaf ribeye meatball jerky. Shankle salami tail meatball ball tip landjaeger pork belly.</p>","    </div>","    <div class=\"step\">","        <h3><span class=\"number\">2</span> Fill in the body</h3>","    </div>","    <div class=\"step\">","        <h3><span class=\"number\">3</span> Replies</h3>","    </div>","</div>","{{ /showTutorial }}"].join("\n");
    });
  })();

  // Return the main app.
  var main = root.require("userde.sk/src/app.js");

  // AMD/RequireJS.
  if (typeof define !== 'undefined' && define.amd) {
  
    define("userde.sk", [ /* load deps ahead of time */ ], function () {
      return main;
    });
  
    define("userdesk", [ /* load deps ahead of time */ ], function () {
      return main;
    });
  
  }

  // CommonJS.
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = main;
  }

  // Globally exported.
  else {
  
    root["userde.sk"] = main;
  
    root["userdesk"] = main;
  
  }

  // Alias our app.
  
  root.require.alias("userde.sk/src/app.js", "userde.sk/index.js");
  
  root.require.alias("userde.sk/src/app.js", "userdesk/index.js");
  
})();