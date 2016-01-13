'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderToString = undefined;

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

var renderToString = exports.renderToString = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(el, model) {
    var queries;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // start caching queries on the model
            model.startCaching();

            // we render to string once so the model gets primed with all the queries it would have received
            _server2.default.renderToString(el);

            queries = [].concat(_toConsumableArray(model.queries.values()));

            model.stopCaching();

            // then, we make a regular fetch to prime the model cache
            _context.next = 6;
            return model.get.apply(model, _toConsumableArray(queries));

          case 6:
            return _context.abrupt('return', _server2.default.renderToString(el));

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function renderToString(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();
// todo - recurse until queries doesn't change