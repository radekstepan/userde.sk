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
      
      load = ['modules/helpers', 'components/header', 'components/submit'];
      
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
          template = require('./templates/page/issue');
          return this.render(template, {}, 'Submit an issue');
        },
        render: function(template, ctx, title) {
          this.element.html(render(template, ctx));
          return document.title = title ? "" + title + " - userde.sk" : 'userde.sk';
        }
      });
      
      module.exports = function(opts) {
        account(opts.account);
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
          '.link.logout click': firebase.logout
        }
      });
      
    });

    
    // submit.coffee
    root.require.register('userde.sk/src/components/submit.js', function(exports, require, module) {
    
      var firebase, user;
      
      user = require('../modules/user');
      
      firebase = require('../modules/firebase');
      
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
    
      var authCb, user;
      
      user = require('./user');
      
      authCb = function() {};
      
      module.exports = new can.Map({
        setClient: function(root, success, error) {
          var client;
          client = new Firebase("https://" + root + ".firebaseio.com");
          this.auth = new FirebaseSimpleLogin(client, function(err, obj) {
            if (err) {
              return authCb(err);
            }
            user(obj);
            return authCb();
          });
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
          return this.auth.login(provider, {
            'rememberMe': true
          });
        },
        logout: function() {
          var _ref;
          if ((_ref = this.auth) != null) {
            _ref.logout();
          }
          return user({});
        }
      });
      
    });

    
    // helpers.coffee
    root.require.register('userde.sk/src/modules/helpers.js', function(exports, require, module) {
    
      var isLoggedIn, user;
      
      user = require('./user');
      
      exports.isLoggedIn = isLoggedIn = function(opts) {
        if (_.has(user(), 'username')) {
          return opts.fn(this);
        } else {
          return opts.inverse(this);
        }
      };
      
      Mustache.registerHelper('isLoggedIn', isLoggedIn);
      
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

    
    // user.coffee
    root.require.register('userde.sk/src/modules/user.js', function(exports, require, module) {
    
      module.exports = can.compute({});
      
    });

    
    // header.mustache
    root.require.register('userde.sk/src/templates/header.js', function(exports, require, module) {
    
      module.exports = ["<div id=\"header\">","    <div class=\"wrapper\">","        <div class=\"user\">","        {{ #isLoggedIn }}","            <a class=\"link logout\">Logout</a> {{ user.value.displayName }}","        {{ /isLoggedIn }}","        </div>","        <div class=\"title\">userde.sk/{{ account.value }}</div>","        <div class=\"menu\">","            <!--","            <ul>","                <li>","                    <a href=\"#\">Link</a>","                </li>","            </ul>","            -->","        </div>","    </div>","</div>"].join("\n");
    });

    
    // login.mustache
    root.require.register('userde.sk/src/templates/login.js', function(exports, require, module) {
    
      module.exports = ["<div id=\"promo\" class=\"login box\">","    <div class=\"left\">","        <div class=\"title\">userde.sk</div>","        <a class=\"link bottom\">About the service</a>","    </div>","","    <div class=\"right\">","        <div class=\"header\">","            <h1>Account Login</h1>","        </div>","        ","        <div class=\"button primary\">Login using GitHub</div>","        ","        <div class=\"bottom\">","            <a class=\"link\">New account</a>","            <a class=\"link\">Login problems?</a>","        </div>","    </div>","</div>"].join("\n");
    });

    
    // issue.mustache
    root.require.register('userde.sk/src/templates/page/issue.js', function(exports, require, module) {
    
      module.exports = ["<app-header></app-header>","<app-submit></app-submit>"].join("\n");
    });

    
    // signup.mustache
    root.require.register('userde.sk/src/templates/signup.js', function(exports, require, module) {
    
      module.exports = ["<div id=\"promo\" class=\"signup box\">","    <div class=\"left\">","        <div class=\"title\">userde.sk</div>","        <a class=\"link bottom\">About the service</a>","    </div>","","    <div class=\"right\">","        <div class=\"header\">","            <h1>Signup</h1>","        </div>","        ","        <div class=\"form\">","            <div class=\"box\">","                <div class=\"field\">","                    <h3>1. GitHub Username</h3>","                    <input class=\"input\" type=\"text\" placeholder=\"Type your username here\" value=\"@radekstepan\" autofocus />","                </div>","            </div>","            ","            <div class=\"box\">","                <div class=\"field\">","                    <h3>2. Contact</h3>","                    <label>Provide an email so that we can contact you when your account is ready.</label>","                    <input class=\"input\" type=\"text\" placeholder=\"Email address\" />","                </div>","            </div>","","            <div class=\"box\">","                <div class=\"field\">","                    <h3>3. Message (optional)</h3>","                    <label>Do you have a special request? Anything we should know?</label>","                    <textarea class=\"input\" rows=4></textarea>","                </div>","            </div>","        </div>","","        <div class=\"button primary\">Send</div>","","        <div class=\"bottom\">","            <a class=\"link\">Check application status</a>","        </div>","    </div>","</div>"].join("\n");
    });

    
    // submit.mustache
    root.require.register('userde.sk/src/templates/submit.js', function(exports, require, module) {
    
      module.exports = ["<div id=\"content\" class=\"box\">","    <div class=\"header\">","        <h2>How can we help?</h2>","        <p>Send us bugs you have encountered or suggestions.</p>","    </div>","","    <div class=\"form\">","        <div class=\"box\">","            <div class=\"field\">","                <h3>1. Title</h3>","                <label>What question would you like to ask?</label>","                <input class=\"input\" type=\"text\" placeholder=\"Type your question here\" value=\"jquery second parent\" autofocus />","            </div>","","            <div id=\"results\">","                <ul>","                    <li><a class=\"link\"><span>jQuery</span> - Getting the <span>second</span> <span>level</span> parent of an element</a> <span class=\"ago\">3 weeks ago</span></li>","                    <li><span class=\"tag solved\">solved</span><a class=\"link\">Find top <span>level</span> <code>li</code> with <span>jQuery</span></a> <span class=\"ago\">Today</span></li>","                    <li><span class=\"tag discussed\">discussed</span><a class=\"link\">Nth-child and grandparent or <span>second</span> <span>level</span> of child</a> <span class=\"ago\">A year ago</span></li>","                    <li><a class=\"link\"><span>jQuery</span> <code>parents()</code> - processing each tier separately</a></li>","                    <li><a class=\"link\"><span>jQuery</span> on <code>click</code> fire <span>second</span> child</a></li>","                    <li><a class=\"link\"><span>Jquery</span> target parent up two <span>levels</span> checkbox</a></li>","                    <li><a class=\"link\">setting border on annotation <span>levels</span> on mouse over in nested spans</a></li>","                    <li><a class=\"link\">always getting error in <code>StagePickLevel</code> class</a></li>","                    <li><a class=\"link\"><span>jquery</span> select all parents</a></li>","                </ul>","            </div>","        </div>","","        <div class=\"box\">","            <div class=\"field\">","                <h3>2. Description</h3>","                <div>","                    <span class=\"preview\">Preview</span>","                    <label>Describe the question you are asking. You can use <a class=\"link\">GitHub Flavored Markdown</a>.</label>","                </div>","                <textarea class=\"input\" rows=4 placeholder=\"Make it simple and easy to understand\"></textarea>","            </div>","        </div>","","        <div class=\"box\">","            <div class=\"field\">","                <h3>3. Contact</h3>","                {{ #isLoggedIn }}","                    Connected as {{ user.value.displayName }}","                {{ else }}","                <!--","                    <label>Provide either an email or connect with <a class=\"link\">GitHub</a>.</label>","                    <div class=\"half first\">","                        <input class=\"input\" type=\"text\" placeholder=\"Email address\" />","                    </div>","                    <div class=\"half second\">","                        <div class=\"button github\">Connect with GitHub</div>","                    </div>","                -->","                    <label>Connect with <a class=\"link\">GitHub</a>. Only your public profile is accessed.</label>","                    <div class=\"button github\">Connect with GitHub</div>","                {{ /isLoggedIn }}","            </div>","        </div>","    </div>","","    <div class=\"footer\">","        <div class=\"button primary\">Finish</div>","    </div>","</div>"].join("\n");
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