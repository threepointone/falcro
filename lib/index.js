'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.connect = connect;
exports.app = app;

var _react = require('react');

var _falcor = require('falcor');

function log() {
  console.log(this);
  return this;
}

function get(paths) {
  var _ref2;

  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref$cached = _ref.cached;
  var cached = _ref$cached === undefined ? true : _ref$cached;
  var _ref$done = _ref.done;
  var done = _ref$done === undefined ? function () {} : _ref$done;

  var value = undefined,
      error = undefined;
  (_ref2 = cached ? this.withoutDataSource() : this).get.apply(_ref2, _toConsumableArray(paths)).subscribe(function (res) {
    return value = res;
  }, function (err) {
    return error = err;
  }, done /* noop*/);

  if (error) {
    throw error;
  }
  return value ? value.json : {};
}

function connect(_ref3) {
  var _ref3$query = _ref3.query;
  var query = _ref3$query === undefined ? function () {
    return [];
  } : _ref3$query;
  var _ref3$fragments = _ref3.fragments;
  var fragments = _ref3$fragments === undefined ? {} : _ref3$fragments;
  var _ref3$params = _ref3.params;
  var params = _ref3$params === undefined ? {} : _ref3$params;
  var _ref3$actionsKey = _ref3.actionsKey;
  var actionsKey = _ref3$actionsKey === undefined ? 'falcro' : _ref3$actionsKey;
  var _ref3$prepare = _ref3.prepare;
  var prepare = _ref3$prepare === undefined ? function (x) {
    return x;
  } : _ref3$prepare;

  return function (Target) {
    return (function (_Component) {
      _inherits(Falcor, _Component);

      function Falcor() {
        var _this = this;

        _classCallCheck(this, Falcor);

        _get(Object.getPrototypeOf(Falcor.prototype), 'constructor', this).apply(this, arguments);

        this.state = {
          params: prepare(params),
          loading: false
        };

        this.set = function () {
          var _context$falcor$withoutDataSource;

          // todo - .set instead of setValue?
          (_context$falcor$withoutDataSource = _this.context.falcor.withoutDataSource()).setValue.apply(_context$falcor$withoutDataSource, arguments).subscribe(function () {}, console.error.bind(console), function () {});
        };

        this.setParams = function (p) {
          var refresh = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

          _this.setState({ params: _extends({}, _this.state.params, p) }, function () {
            if (refresh) {
              _this.refresh();
            }
          });
        };

        this.refresh = function () {
          var _context;

          // funny thing here - race conditions don't really matter because we're pointing to ids
          _this.setState({ loading: true });
          // this should silently trigger the update
          (_context = _this.context.falcor, get).call(_context, query(prepare(_this.state.params)), {
            cached: false,
            done: function done() {
              return _this.setState({ loading: false });
            }
          });
        };

        this.actions = {
          set: this.set,
          refresh: this.refresh,
          setParams: this.setParams
        };
      }

      _createClass(Falcor, [{
        key: 'getValue',
        value: function getValue() {
          try {
            var _context2;

            return (_context2 = this.context.falcor, get).call(_context2, query(prepare(this.state.params)));
          } catch (error) {
            return { error: error };
          }
        }
      }, {
        key: 'render',
        value: function render() {
          return (0, _react.createElement)(Target, _extends({}, this.props, this.getValue(), _defineProperty({
            params: prepare(this.state.params),
            loading: this.state.loading
          }, actionsKey, this.actions)), this.props.children);
        }
      }], [{
        key: 'getQuery',
        value: function getQuery() {
          return query;
        }
      }, {
        key: 'getFragment',
        value: function getFragment(key) {
          return fragments(key);
        }
      }, {
        key: 'getDefaultParams',
        value: function getDefaultParams() {
          return params;
        }

        // these 2 should be pulled out via an 'indexer' ala om next
        // else we won't have replay
        // for now though, could work
      }, {
        key: 'displayName',
        value: 'ƒ:' + Target.displayName,
        enumerable: true
      }, {
        key: 'contextTypes',
        value: {
          falcor: _react.PropTypes.instanceOf(_falcor.Model).isRequired
        },
        enumerable: true
      }]);

      return Falcor;
    })(_react.Component);
  };
}

var Provider = (function (_Component2) {
  _inherits(Provider, _Component2);

  function Provider() {
    _classCallCheck(this, Provider);

    _get(Object.getPrototypeOf(Provider.prototype), 'constructor', this).apply(this, arguments);
  }

  // this boilerplate needed to 'hoist' control to the top

  _createClass(Provider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return { falcor: this.props.model };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react.Children.only(this.props.children);
    }
  }], [{
    key: 'propTypes',
    value: {
      model: _react.PropTypes.instanceOf(_falcor.Model).isRequired,
      children: _react.PropTypes.element.isRequired
    },
    enumerable: true
  }, {
    key: 'childContextTypes',
    value: {
      falcor: _react.PropTypes.instanceOf(_falcor.Model).isRequired
    },
    enumerable: true
  }]);

  return Provider;
})(_react.Component);

exports.Provider = Provider;

function app(_x3, _x4) {
  var _again = true;

  _function: while (_again) {
    var options = _x3,
        then = _x4;

    var onChange = function onChange() {
      if (started) {
        then(model);
      }
      started = true;
    };

    _again = false;

    if (typeof options === 'function') {
      _x3 = {};
      _x4 = options;
      _again = true;
      continue _function;
    }
    // this weirdness because Model::onChange fires immediately *while* initializing
    // leaving model still undefined, however will try to trigger a render where you'll
    // have to pass it down... it's a mess
    // will think aof a better solution later, this is good for now
    var started = false,
        model = undefined;

    model = new _falcor.Model(_extends({}, options, { onChange: onChange })).batch();
    onChange();
  }
}

// the next 3 are passed down in `props.<actionsKey>`