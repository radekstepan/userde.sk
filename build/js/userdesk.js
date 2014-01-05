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
    
      var Routing, account, firebase, load, render, user;
      
      firebase = require('./modules/firebase');
      
      user = require('./modules/user');
      
      account = require('./modules/account');
      
      render = require('./modules/render');
      
      load = ['modules/helpers', 'components/header', 'components/submit', 'components/notify', 'components/results', 'components/result'];
      
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
        route: function() {},
        ':org/:repo route': function(data) {
          var template;
          account("" + data.org + "/" + data.repo);
          template = require('./templates/page/submit');
          return this.render(template, {}, 'Submit an issue');
        },
        render: function(template, ctx, title) {
          this.element.html(render(template, ctx));
          return document.title = title ? "" + title + " - userde.sk" : 'userde.sk';
        }
      });
      
      module.exports = function(opts) {
        firebase.attr('client', opts.firebase);
        new Routing(opts.el);
        return can.route.ready();
      };
      
    });

    
    // header.coffee
    root.require.register('userde.sk/src/components/header.js', function(exports, require, module) {
    
      var account, firebase, user;
      
      account = require('../modules/account');
      
      user = require('../modules/user');
      
      firebase = require('../modules/firebase');
      
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
            }
          };
        },
        events: {
          '#account .logout click': function() {
            return firebase.logout();
          },
          '#account click': function() {
            return $('#account .dropdown').toggle();
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

    
    // submit.coffee
    root.require.register('userde.sk/src/components/submit.js', function(exports, require, module) {
    
      var firebase, github, input, request_id, results, search, user;
      
      user = require('../modules/user');
      
      firebase = require('../modules/firebase');
      
      github = require('../modules/github');
      
      results = require('../modules/results');
      
      request_id = 0;
      
      search = can.compute('');
      
      search.bind('change', function(ev, value) {
        var our_id;
        if (!value) {
          return results.replace([]);
        }
        our_id = ++request_id;
        return github.search(value, function(err, res) {
          if (our_id !== request_id) {
            return console.log('ignoring', value);
          }
          if (err) {
            return;
          }
          return results.replace(res.items);
        });
      });
      
      input = function(el, evt) {
        el.closest('.box').addClass('focus');
        return search(el.val());
      };
      
      module.exports = can.Component.extend({
        tag: 'app-submit',
        template: require('../templates/submit'),
        scope: function() {
          return {
            'user': {
              'value': user
            }
          };
        },
        events: {
          '.button.github click': function() {
            return firebase.login(function(err) {
              if (err) {
                throw err;
              }
            });
          },
          '.input.title keyup': _.debounce(input, 2e2),
          '.input.title focus': input,
          '.input.title focusout': function(el) {
            return el.closest('.box').removeClass('focus');
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
          state.load('Loading GitHub account');
          return this.auth.login(provider, {
            'rememberMe': true
          });
        },
        logout: function() {
          var _ref;
          if ((_ref = this.auth) != null) {
            _ref.logout();
          }
          user({});
          return state.info('You have logged out');
        }
      });
      
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
            'protocol': 'https',
            'host': 'api.github.com',
            'path': "/search/issues",
            'query': {
              'q': "" + text + "+repo:" + (account()),
              'sort': 'updated',
              'order': 'desc'
            },
            'headers': headers()
          }, cb);
        }
      };
      
      request = function(_arg, cb) {
        var exited, headers, host, k, path, protocol, q, query, req, timeout, v;
        protocol = _arg.protocol, host = _arg.host, path = _arg.path, query = _arg.query, headers = _arg.headers;
        exited = false;
        q = query ? '?' + ((function() {
          var _results;
          _results = [];
          for (k in query) {
            v = query[k];
            _results.push("" + k + "=" + v);
          }
          return _results;
        })()).join('&') : '';
        req = superagent.get("" + protocol + "://" + host + path + q);
        for (k in headers) {
          v = headers[k];
          req.set(k, v);
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
    
      var ago, isLoggedIn, user;
      
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
      
      Mustache.registerHelper('isLoggedIn', isLoggedIn);
      
      Mustache.registerHelper('ago', ago);
      
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
    
      module.exports = can.compute({});
      
    });

    
    // header.mustache
    root.require.register('userde.sk/src/templates/header.js', function(exports, require, module) {
    
      module.exports = ["<div id=\"header\">","    <div class=\"wrapper\">","        <div id=\"account\">","        {{ #isLoggedIn }}","            {{ user.value.displayName }} <a class=\"icon user\"></a>","            <div class=\"dropdown\">","                <div class=\"section profile\">","                    <div class=\"avatar\">","                        <div class=\"icon user\"></div>","                    </div>","                    <div class=\"email\">","                        {{ user.value.email }}","                    </div>","                    <a class=\"primary button small settings\">Settings</a>","                </div>","                <ul class=\"section menu\">","                    <li>","                        <a class=\"logout\">Logout</a>","                    </li>","                </ul>","            </div>","        {{ /isLoggedIn }}","        </div>","        <div id=\"title\">userde.sk/{{ account.value }}</div>","        <div id=\"menu\">","            <!--","            <ul>","                <li>","                    <a href=\"#\">Link</a>","                </li>","            </ul>","            -->","        </div>","    </div>","</div>"].join("\n");
    });

    
    // login.mustache
    root.require.register('userde.sk/src/templates/login.js', function(exports, require, module) {
    
      module.exports = ["<div id=\"promo\" class=\"login box\">","    <div class=\"left\">","        <div class=\"title\">userde.sk</div>","        <a class=\"link bottom\">About the service</a>","    </div>","","    <div class=\"right\">","        <div class=\"header\">","            <h1>Account Login</h1>","        </div>","        ","        <div class=\"button primary\">Login using GitHub</div>","        ","        <div class=\"bottom\">","            <a class=\"link\">New account</a>","            <a class=\"link\">Login problems?</a>","        </div>","    </div>","</div>"].join("\n");
    });

    
    // notify.mustache
    root.require.register('userde.sk/src/templates/notify.js', function(exports, require, module) {
    
      module.exports = ["{{ #isVisible }}","<div id=\"notify\" class=\"{{ type }}\">","    <div class=\"message\">","        <div class=\"wrapper\">","            <div class=\"content\">","                {{{ text }}}","            </div>","        </div>","    </div>","</div>","{{ /isVisible }}"].join("\n");
    });

    
    // submit.mustache
    root.require.register('userde.sk/src/templates/page/submit.js', function(exports, require, module) {
    
      module.exports = ["<app-notify></app-notify>","<app-header></app-header>","<app-submit></app-submit>"].join("\n");
    });

    
    // result.mustache
    root.require.register('userde.sk/src/templates/result.js', function(exports, require, module) {
    
      module.exports = ["{{ #closed_at }}","<span class=\"tag closed\">closed</span>","{{ /closed_at }}","","<a target=\"new\" href=\"{{ html_url }}\" class=\"link\">{{ title }}</a>","","<span class=\"ago\">{{ ago updated_at }}</span>"].join("\n");
    });

    
    // results.mustache
    root.require.register('userde.sk/src/templates/results.js', function(exports, require, module) {
    
      module.exports = ["{{ #if results.length }}","<div id=\"results\">","    <ul>","        {{ #results }}","        <li><app-result></app-result></li>","        {{ /results }}","    </ul>","</div>","{{ /if }}"].join("\n");
    });

    
    // signup.mustache
    root.require.register('userde.sk/src/templates/signup.js', function(exports, require, module) {
    
      module.exports = ["<div id=\"promo\" class=\"signup box\">","    <div class=\"left\">","        <div class=\"title\">userde.sk</div>","        <a class=\"link bottom\">About the service</a>","    </div>","","    <div class=\"right\">","        <div class=\"header\">","            <h1>Signup</h1>","        </div>","        ","        <div class=\"form\">","            <div class=\"box\">","                <div class=\"field\">","                    <h3>1. GitHub Username</h3>","                    <input class=\"input\" type=\"text\" placeholder=\"Type your username here\" value=\"@radekstepan\" autofocus />","                </div>","            </div>","            ","            <div class=\"box\">","                <div class=\"field\">","                    <h3>2. Contact</h3>","                    <label>Provide an email so that we can contact you when your account is ready.</label>","                    <input class=\"input\" type=\"text\" placeholder=\"Email address\" />","                </div>","            </div>","","            <div class=\"box\">","                <div class=\"field\">","                    <h3>3. Message (optional)</h3>","                    <label>Do you have a special request? Anything we should know?</label>","                    <textarea class=\"input\" rows=4></textarea>","                </div>","            </div>","        </div>","","        <div class=\"button primary\">Send</div>","","        <div class=\"bottom\">","            <a class=\"link\">Check application status</a>","        </div>","    </div>","</div>"].join("\n");
    });

    
    // submit.mustache
    root.require.register('userde.sk/src/templates/submit.js', function(exports, require, module) {
    
      module.exports = ["<div id=\"content\" class=\"box\">","    <div class=\"header\">","        <h2>How can we help?</h2>","        <p>Send us bugs you have encountered or suggestions.</p>","    </div>","","    <div class=\"form\">","        <div class=\"box\">","            <div class=\"field\">","                <h3>1. Title</h3>","                <label>What question would you like to ask?</label>","                <input class=\"input title\" type=\"text\" placeholder=\"Type your question here\" autofocus />","            </div>","            <app-results></app-results>","        </div>","","        <div class=\"box\">","            <div class=\"field\">","                <h3>2. Description</h3>","                <div>","                    <span class=\"preview\">Preview</span>","                    <label>Describe the question you are asking. You can use <a class=\"link\">GitHub Flavored Markdown</a>.</label>","                </div>","                <textarea class=\"input\" rows=4 placeholder=\"Make it simple and easy to understand\"></textarea>","            </div>","        </div>","","        <div class=\"box\">","            <div class=\"field\">","                <h3>3. Contact</h3>","                {{ #isLoggedIn }}","                    Connected as {{ user.value.displayName }}","                {{ else }}","                <!--","                    <label>Provide either an email or connect with <a class=\"link\">GitHub</a>.</label>","                    <div class=\"half first\">","                        <input class=\"input\" type=\"text\" placeholder=\"Email address\" />","                    </div>","                    <div class=\"half second\">","                        <div class=\"button github\">Connect with GitHub</div>","                    </div>","                -->","                    <label>Connect with <a class=\"link\">GitHub</a>. Only your public profile is accessed.</label>","                    <div class=\"button github\">Connect with GitHub</div>","                {{ /isLoggedIn }}","            </div>","        </div>","    </div>","","    <div class=\"footer\">","        <div class=\"button primary\">Finish</div>","    </div>","</div>"].join("\n");
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