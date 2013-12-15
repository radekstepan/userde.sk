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
    
      module.exports = function() {
        return $('body').html(require('./templates/app')());
      };
      
    });

    
    // app.eco
    root.require.register('app/src/templates/app.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<div id="header">\n    <div class="wrapper">\n        <div class="title">userde.sk/intermine</div>\n        <div class="menu">\n            <ul>\n                <li><a>Is this safe?</a></li>\n                <li><a>Contact in person</a></li>\n                <li><a>See a map</a></li>\n            </ul>\n        </div>\n    </div>\n</div>\n\n<div id="content">\n    <div class="header">\n        <h2>How can we help?</h2>\n        <p>Send us bugs you have encountered or suggestions.</p>\n    </div>\n\n    <div class="form">\n        <div class="box">\n            <div class="field">\n                <h3>1. Title</h3>\n                <label>What question would you like to ask?</label>\n                <input class="input" type="text" placeholder="Type your question here" value="jquery second parent" autofocus />\n            </div>\n\n            <div id="results">\n                <ul>\n                    <li><a class="link"><span>jQuery</span> - Getting the <span>second</span> <span>level</span> parent of an element</a> <span class="ago">3 weeks ago</span></li>\n                    <li><span class="tag solved">solved</span><a class="link">Find top <span>level</span> <code>li</code> with <span>jQuery</span></a> <span class="ago">Today</span></li>\n                    <li><span class="tag discussed">discussed</span><a class="link">Nth-child and grandparent or <span>second</span> <span>level</span> of child</a> <span class="ago">A year ago</span></li>\n                    <li><a class="link"><span>jQuery</span> <code>parents()</code> - processing each tier separately</a></li>\n                    <li><a class="link"><span>jQuery</span> on <code>click</code> fire <span>second</span> child</a></li>\n                    <li><a class="link"><span>Jquery</span> target parent up two <span>levels</span> checkbox</a></li>\n                    <li><a class="link">setting border on annotation <span>levels</span> on mouse over in nested spans</a></li>\n                    <li><a class="link">always getting error in <code>StagePickLevel</code> class</a></li>\n                    <li><a class="link"><span>jquery</span> select all parents</a></li>\n                </ul>\n            </div>\n        </div>\n\n        <div class="box">\n            <div class="field">\n                <h3>2. Description</h3>\n                <div>\n                    <span class="preview">Preview</span>\n                    <label>Describe the question you are asking. You can use <a class="link">GitHub Flavored Markdown</a>.</label>\n                </div>\n                <textarea class="input" rows=4 placeholder="Make it simple and easy to understand"></textarea>\n            </div>\n        </div>\n\n        <div class="box">\n            <div class="field">\n                <h3>3. Contact</h3>\n                <label>Provide either an email or connect with <a class="link">GitHub</a>.</label>\n                <div class="half first">\n                    <input class="input" type="text" placeholder="Email address" />\n                </div>\n                <div class="half second">\n                    <div class="button github">Connect with GitHub</div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class="footer">\n        <div class="button primary">Finish</div>\n    </div>\n</div>');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
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