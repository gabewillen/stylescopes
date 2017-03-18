'use strict';

exports.__esModule = true;
exports.default = exports.css = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Style2 = require('./Style');

Object.defineProperty(exports, 'css', {
    enumerable: true,
    get: function get() {
        return _Style2.css;
    }
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Scope = require('./Scope');

var _Scope2 = _interopRequireDefault(_Scope);

var _Style3 = _interopRequireDefault(_Style2);

var _Template = require('./Template');

var _Template2 = _interopRequireDefault(_Template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function omit(obj, keys) {
    return (Object.keys(obj) || []).reduce(function (newObj, key) {
        if (keys.indexOf(key) < 0) {
            newObj[key] = obj[key];
        }
        return newObj;
    }, {});
}

function pick(obj, keys) {
    return (Object.keys(obj) || []).reduce(function (newObj, key) {
        if (keys.indexOf(key) >= 0) {
            newObj[key] = obj[key];
        }
        return newObj;
    }, {});
}

var StyleScope = function (_Style) {
    _inherits(StyleScope, _Style);

    function StyleScope() {
        _classCallCheck(this, StyleScope);

        return _possibleConstructorReturn(this, _Style.apply(this, arguments));
    }

    StyleScope.Component = function Component(_Component) {
        var _class, _temp;

        var Style = this;
        if (Style.textContent instanceof _Template2.default) {
            var text = this.textContent.tag();
            Style.preprocess(text);
        }
        var stylePropKeys = Object.keys(Style.propTypes);
        return _temp = _class = function (_StyleScope) {
            _inherits(_class, _StyleScope);

            function _class(props) {
                _classCallCheck(this, _class);

                var _this2 = _possibleConstructorReturn(this, _StyleScope.call(this, props));

                _this2.uid = 'scope-' + _shortid2.default.generate();
                return _this2;
            }

            _class.prototype.render = function render() {
                var styleProps = pick(this.props, stylePropKeys);
                var props = omit(this.props, stylePropKeys);
                var className = (0, _classnames2.default)(this.uid, this.props.className);
                return _react2.default.createElement(
                    _Scope2.default,
                    { className: className },
                    _react2.default.createElement(Style, _extends({}, props, { styleProps: styleProps, className: className })),
                    _react2.default.createElement(_Component, props)
                );
            };

            return _class;
        }(StyleScope), _class.defaultProps = _extends({}, Style.defaultProps, _Component.defaultProps || {}), _class.propTypes = _extends({}, Style.propTypes, _Component.propTypes || {}), _temp;
    };

    return StyleScope;
}(_Style3.default);

exports.default = StyleScope;