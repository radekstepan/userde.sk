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
    root.require.register('app/src/app.js', function(exports, require, module) {
    
      var Header, canComponent, canControl, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      canControl = require('./core/control');
      
      canComponent = require('./core/component');
      
      Header = (function(_super) {
        __extends(Header, _super);
      
        function Header() {
          _ref = Header.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        Header.prototype.tag = 'app-header';
      
        Header.prototype.template = require('./templates/header');
      
        Header.prototype.scope = {
          menu: function() {
            return [
              {
                'name': 'Submit a new issue'
              }, {
                'name': 'Signup'
              }, {
                'name': 'Login'
              }
            ];
          },
          visible: true
        };
      
        Header.prototype.helpers = {
          link: function(name) {
            return can.route.link(name, {});
          }
        };
      
        return Header;
      
      })(canComponent);
      
      module.exports = function() {
        can.route('account/login');
        can.route.ready();
        return new Header('#header');
      };
      
    });

    
    // component.coffee
    root.require.register('app/src/core/component.js', function(exports, require, module) {
    
      var canComponent;
      
      canComponent = (function() {
        function canComponent() {
          var k, opts, v;
          opts = {};
          for (k in this) {
            v = this[k];
            if (k !== 'constructor') {
              opts[k] = v;
            }
          }
          can.Component.extend(opts);
        }
      
        return canComponent;
      
      })();
      
      module.exports = canComponent;
      
    });

    
    // control.coffee
    root.require.register('app/src/core/control.js', function(exports, require, module) {
    
      var canControl;
      
      canControl = (function() {
        function canControl(el, opts) {
          var Ctrl, k, v;
          opts = {};
          for (k in this) {
            v = this[k];
            if (k !== 'constructor') {
              opts[k] = v;
            }
          }
          Ctrl = can.Control(opts);
          new Ctrl(el, opts);
        }
      
        return canControl;
      
      })();
      
      module.exports = canControl;
      
    });

    
    // header.mustache
    root.require.register('app/src/templates/header.js', function(exports, require, module) {
    
      module.exports = ["{{ #if visible }}","<div id=\"header\">","    <div class=\"wrapper\">","        <div class=\"title\">userde.sk/intermine</div>","        <div class=\"menu\">","            <ul>","                {{ #each menu }}","                <li><a class=\"{{ #if active }}active{{ /if }}\">{{ name }}</a></li>","                {{ /each }}","            </ul>","        </div>","    </div>","</div>","{{ /if }}"].join("\n");
    });

    
    // index.mustache
    root.require.register('app/src/templates/index.js', function(exports, require, module) {
    
      module.exports = ["Index page"].join("\n");
    });

    
    // issue.mustache
    root.require.register('app/src/templates/issue.js', function(exports, require, module) {
    
      module.exports = ["<div id=\"header\"></div>","","<div id=\"content\">","    <div class=\"header\">","        <h2>How can we help?</h2>","        <p>Send us bugs you have encountered or suggestions.</p>","    </div>","","    <div class=\"form\">","        <div class=\"box\">","            <div class=\"field\">","                <h3>1. Title</h3>","                <label>What question would you like to ask?</label>","                <input class=\"input\" type=\"text\" placeholder=\"Type your question here\" value=\"jquery second parent\" autofocus />","            </div>","","            <div id=\"results\">","                <ul>","                    <li><a class=\"link\"><span>jQuery</span> - Getting the <span>second</span> <span>level</span> parent of an element</a> <span class=\"ago\">3 weeks ago</span></li>","                    <li><span class=\"tag solved\">solved</span><a class=\"link\">Find top <span>level</span> <code>li</code> with <span>jQuery</span></a> <span class=\"ago\">Today</span></li>","                    <li><span class=\"tag discussed\">discussed</span><a class=\"link\">Nth-child and grandparent or <span>second</span> <span>level</span> of child</a> <span class=\"ago\">A year ago</span></li>","                    <li><a class=\"link\"><span>jQuery</span> <code>parents()</code> - processing each tier separately</a></li>","                    <li><a class=\"link\"><span>jQuery</span> on <code>click</code> fire <span>second</span> child</a></li>","                    <li><a class=\"link\"><span>Jquery</span> target parent up two <span>levels</span> checkbox</a></li>","                    <li><a class=\"link\">setting border on annotation <span>levels</span> on mouse over in nested spans</a></li>","                    <li><a class=\"link\">always getting error in <code>StagePickLevel</code> class</a></li>","                    <li><a class=\"link\"><span>jquery</span> select all parents</a></li>","                </ul>","            </div>","        </div>","","        <div class=\"box\">","            <div class=\"field\">","                <h3>2. Description</h3>","                <div>","                    <span class=\"preview\">Preview</span>","                    <label>Describe the question you are asking. You can use <a class=\"link\">GitHub Flavored Markdown</a>.</label>","                </div>","                <textarea class=\"input\" rows=4 placeholder=\"Make it simple and easy to understand\"></textarea>","            </div>","        </div>","","        <div class=\"box\">","            <div class=\"field\">","                <h3>3. Contact</h3>","                <label>Provide either an email or connect with <a class=\"link\">GitHub</a>.</label>","                <div class=\"half first\">","                    <input class=\"input\" type=\"text\" placeholder=\"Email address\" />","                </div>","                <div class=\"half second\">","                    <div class=\"button github\">Connect with GitHub</div>","                </div>","            </div>","        </div>","    </div>","","    <div class=\"footer\">","        <div class=\"button primary\">Finish</div>","    </div>","</div>"].join("\n");
    });

    
    // layout.mustache
    root.require.register('app/src/templates/layout.js', function(exports, require, module) {
    
      module.exports = ["<app-header></app-header>"].join("\n");
    });

    
    // login.mustache
    root.require.register('app/src/templates/login.js', function(exports, require, module) {
    
      module.exports = ["<div id=\"promo\" class=\"login box\">","    <div class=\"left\">","        <div class=\"title\">userde.sk</div>","        <a class=\"link bottom\">About the service</a>","    </div>","","    <div class=\"right\">","        <div class=\"header\">","            <h1>Account Login</h1>","        </div>","        ","        <div class=\"button primary\">Login using GitHub</div>","        ","        <div class=\"bottom\">","            <a class=\"link\">New account</a>","            <a class=\"link\">Login problems?</a>","        </div>","    </div>","</div>"].join("\n");
    });

    
    // signup.mustache
    root.require.register('app/src/templates/signup.js', function(exports, require, module) {
    
      module.exports = ["<div id=\"promo\" class=\"signup box\">","    <div class=\"left\">","        <div class=\"title\">userde.sk</div>","        <a class=\"link bottom\">About the service</a>","    </div>","","    <div class=\"right\">","        <div class=\"header\">","            <h1>Signup</h1>","        </div>","        ","        <div class=\"form\">","            <div class=\"box\">","                <div class=\"field\">","                    <h3>1. GitHub Username</h3>","                    <input class=\"input\" type=\"text\" placeholder=\"Type your username here\" value=\"@radekstepan\" autofocus />","                </div>","            </div>","            ","            <div class=\"box\">","                <div class=\"field\">","                    <h3>2. Contact</h3>","                    <label>Provide an email so that we can contact you when your account is ready.</label>","                    <input class=\"input\" type=\"text\" placeholder=\"Email address\" />","                </div>","            </div>","","            <div class=\"box\">","                <div class=\"field\">","                    <h3>3. Message (optional)</h3>","                    <label>Do you have a special request? Anything we should know?</label>","                    <textarea class=\"input\" rows=4></textarea>","                </div>","            </div>","        </div>","","        <div class=\"button primary\">Send</div>","","        <div class=\"bottom\">","            <a class=\"link\">Check application status</a>","        </div>","    </div>","</div>"].join("\n");
    });
  })();

  // Return the main app.
  var main = root.require("app/src/app.js");

  // AMD/RequireJS.
  if (typeof define !== 'undefined' && define.amd) {
  
    define("app", [ /* load deps ahead of time */ ], function () {
      return main;
    });
  
  }

  // CommonJS.
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = main;
  }

  // Globally exported.
  else {
  
    root["app"] = main;
  
  }

  // Alias our app.
  
  root.require.alias("app/src/app.js", "app/index.js");
  
})();