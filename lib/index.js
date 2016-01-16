'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = exports.Root = exports.Get = undefined;
exports.routeByCollectionId = routeByCollectionId;

var _react = require('react');

var _falcor = require('falcor');

var _falcor2 = _interopRequireDefault(_falcor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function log() {
  var msg = arguments.length <= 0 || arguments[0] === undefined ? this : arguments[0];

  console.log(msg);
  return this;
}

// synchronous `get` operation on a model (bypasses datasources)
// `let response = model::get(paths);`
// throws on error
function get(paths) {
  var _withoutDataSource;

  paths = paths.filter(function (p) {
    return p.trim();
  });

  var value = undefined,
      error = undefined;
  (_withoutDataSource = this.withoutDataSource()).get.apply(_withoutDataSource, _toConsumableArray(paths)).subscribe(function (res) {
    return value = res.json;
  }, function (err) {
    return error = err;
  }, function () {} /* noop*/);

  if (error) {
    throw error;
  }
  return value;
}

// asynchronous get on the model
// accepts a callback
function aget(paths, done) {
  paths = paths.filter(function (p) {
    return p.trim();
  });

  var value = undefined,
      error = undefined;
  this.get.apply(this, _toConsumableArray(paths)).subscribe(function (res) {
    return value = res.json;
  }, function (err) {
    return error = err;
  }, function () {
    return done(error, value);
  } /* noop*/);
}

// 'Get' as a component

var Get = exports.Get = function (_Component) {
  _inherits(Get, _Component);

  function Get() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, Get);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Get)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  // these 2 should be pulled out via an 'indexer' ala om next
  // else we won't have replay
  // for now though, could work

  // the next 3 are passed down in `$`

  _createClass(Get, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.context.ƒregister(this);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.context.ƒunregister(this);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.refresh();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(next) {
      this.refresh(next);
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      try {
        var _context;

        this.context.falcor.cacheQuery(this.props.query);
        return this.props.select((_context = this.context.falcor, get).call(_context, [this.props.query]));
      } catch (error) {
        return { error: error };
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children(_extends({}, this.getValue(), {
        loading: this.state.loading,
        $: this.actions
      }));
    }
  }]);

  return Get;
}(_react.Component);

Get.propTypes = {
  query: _react.PropTypes.string.isRequired,
  select: _react.PropTypes.func.isRequired
};
Get.defaultProps = {
  select: function select(x) {
    return x;
  }
};
Get.contextTypes = {
  falcor: _react.PropTypes.instanceOf(_falcor2.default.Model).isRequired,
  ƒregister: _react.PropTypes.func,
  ƒunregister: _react.PropTypes.func
};

var _initialiseProps = function _initialiseProps() {
  var _this6 = this;

  this.state = {
    loading: false
  };

  this.setValue = function (path, value) {
    var _context3;

    var remote = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    // todo - .set instead of setValue?
    var f = remote ? _this6.context.falcor : _this6.context.falcor.withoutDataSource();
    f.setValue(path, value).subscribe(function () {}, (_context3 = console).error.bind(_context3), function () {});
  };

  this.call = function (path, args) {
    var refPaths = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    var _context4;

    var thisPaths = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];
    var refresh = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];

    _this6.context.falcor.call(path, args, refPaths, thisPaths).subscribe(function () {
      return refresh ? _this6.refresh() : null;
    }, (_context4 = console).error.bind(_context4), function () {});
  };

  this.refresh = function () {
    var _context5;

    var props = arguments.length <= 0 || arguments[0] === undefined ? _this6.props : arguments[0];

    // funny thing here - race conditions don't really matter because we're pointing to ids
    _this6.setState({ loading: true });
    // this should silently trigger the update
    (_context5 = _this6.context.falcor, aget).call(_context5, [props.query], function () {
      return _this6.setState({ loading: false });
    });
  };

  this.actions = {
    setValue: this.setValue,
    refresh: this.refresh,
    call: this.call
  };
};

var Root = exports.Root = function (_Component2) {
  _inherits(Root, _Component2);

  function Root() {
    var _Object$getPrototypeO2;

    var _temp2, _this2, _ret2;

    _classCallCheck(this, Root);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(Root)).call.apply(_Object$getPrototypeO2, [this].concat(args))), _this2), _this2.components = [], _this2.register = function (c) {
      _this2.components.push(c);
    }, _this2.unregister = function (c) {
      _this2.components = _this2.components.filter(function (x) {
        return x !== c;
      });
    }, _temp2), _possibleConstructorReturn(_this2, _ret2);
  }

  _createClass(Root, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        falcor: this.props.model,
        ƒregister: this.register,
        ƒunregister: this.unregister
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this3 = this;

      this.modelChange$ = this.props.model.listen(function () {
        return _this3.components.forEach(function (c) {
          return c.refresh();
        });
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.modelChange$.dispose();
      delete this.modelChange;
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return Root;
}(_react.Component);

Root.propTypes = {
  model: _react.PropTypes.instanceOf(_falcor2.default.Model).isRequired
};
Root.childContextTypes = {
  falcor: _react.PropTypes.instanceOf(_falcor2.default.Model).isRequired,
  ƒregister: _react.PropTypes.func,
  ƒunregister: _react.PropTypes.func
};

var Model = exports.Model = function (_falcor$Model) {
  _inherits(Model, _falcor$Model);

  function Model() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Model);

    // this weird bit because onChange fires synchronously once inside the constructor
    // we discard the first event, and expose .listen to get back some sanity
    var _change = options.onChange || function () {};
    var _started = false;

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Model).call(this, _extends({}, options, { onChange: function onChange() {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        if (_started) {
          _change.apply(undefined, args);
          _this4.handlers.forEach(function (h) {
            return h.apply(undefined, args);
          });
        }
        _started = true;
      } })));

    _this4.handlers = [];
    _this4.queries = new Set();
    _this4.__caching__ = false;
    return _this4;
  }

  _createClass(Model, [{
    key: 'startCaching',
    value: function startCaching() {
      this.__caching__ = true;
    }
  }, {
    key: 'stopCaching',
    value: function stopCaching() {
      this.__caching__ = false;
      this.queries = new Set();
    }
  }, {
    key: 'cacheQuery',
    value: function cacheQuery(q) {
      if (this.__caching__) {
        this.queries.add(q);
      }
    }
  }, {
    key: 'listen',
    value: function listen(fn) {
      var _this5 = this;

      this.handlers.push(fn);
      return { dispose: function dispose() {
          return _this5.handlers = _this5.handlers.filter(fn);
        } };
    }
  }]);

  return Model;
}(_falcor2.default.Model);

function routeByCollectionId(key, fetch) {
  return {
    route: key + '[{keys:ids}]',
    get: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(pathSet) {
        var responses;
        return regeneratorRuntime.wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return Promise.all(pathSet.ids.map(fetch));

              case 2:
                responses = _context2.sent;
                return _context2.abrupt('return', pathSet.ids.map(function (id, i) {
                  return { path: [key, id], value: responses[i] };
                }));

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee, this);
      }));

      return function get(_x3) {
        return ref.apply(this, arguments);
      };
    }()
  };
}