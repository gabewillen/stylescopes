'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
    var _class, _temp;

    var stylePropTypes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var defaultStyleProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!objectValues(stylePropTypes).every(isPropType)) {
        defaultStyleProps = stylePropTypes;
        stylePropTypes = {};
    }
    var stylePropKeys = Object.keys(stylePropTypes);
    return _temp = _class = function (_StyleBase) {
        _inherits(Style, _StyleBase);

        function Style(props) {
            _classCallCheck(this, Style);

            var _this2 = _possibleConstructorReturn(this, _StyleBase.call(this, props));

            _this2.root = Style.root.clone();
            _this2.dynamicDecls = [];
            _this2.textContent = _this2.root.toResult().css;

            _this2.root.walkDecls(function (node) {
                var value = node.value;
                var matches = value.match(DYNAMIC_DECL_REGEX);
                if (matches) {
                    if (matches.length) {
                        _this2.dynamicDecls.push([node, value, matches.map(function (match) {
                            return match.slice(1, -1);
                        })]);
                    }
                }
            });
            return _this2;
        }

        Style._preprocess = function _preprocess() {
            // here we generate our postcss ast
            var css = this._tag.apply(this, [this.template.strings].concat(this.template.keys));
            this.root = POSTCSS.process('{ > *:last-child {' + css + '} }').root;
        };

        Style.embed = function embed(Component) {
            var _class2, _temp2;

            Style._preprocess();
            return _temp2 = _class2 = function (_React$Component2) {
                _inherits(ScopedStyle, _React$Component2);

                function ScopedStyle(props) {
                    _classCallCheck(this, ScopedStyle);

                    var _this3 = _possibleConstructorReturn(this, _React$Component2.call(this, props));

                    _this3.uid = 'scope-' + _shortid2.default.generate();
                    return _this3;
                }

                ScopedStyle.prototype.render = function render() {
                    var styleProps = pick(this.props, stylePropKeys);
                    var props = omit(this.props, stylePropKeys);
                    var className = (0, _classnames2.default)(this.uid, props.className);
                    return _react2.default.createElement(
                        'span',
                        { className: className },
                        _react2.default.createElement(Style, _extends({}, props, { styleProps: styleProps, className: className })),
                        _react2.default.createElement(Component, props)
                    );
                };

                return ScopedStyle;
            }(_react2.default.Component), _class2.propTypes = _extends({}, stylePropTypes, Component.propTypes), _class2.defaultProps = _extends({}, defaultStyleProps, Component.defaultProps), _temp2;
        };

        Style._tag = function _tag(strings) {
            for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                keys[_key - 1] = arguments[_key];
            }

            return strings.map(function (string, index) {
                var key = keys[index];
                if (key) {
                    return string + ' `' + index + '`';
                }
                return string;
            }).join('').split('\n').map(function (line) {
                if (line.indexOf('{') >= 0 || line.indexOf('}') >= 0) {
                    return line.trim();
                } else {
                    return '    ' + line.trim();
                }
            }).join('\n');
        };

        Style.css = function css(strings) {
            for (var _len2 = arguments.length, keys = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                keys[_key2 - 1] = arguments[_key2];
            }

            var template = Style.template;
            strings.forEach(function (string, index) {
                var key = keys[index];
                if (!strings[index].trim() && key.prototype instanceof StyleBase) {
                    var _template$strings, _template$keys;

                    var _key$template = key.template,
                        baseStrings = _key$template[0],
                        baseKeys = _key$template.slice(1);

                    (_template$strings = template.strings).push.apply(_template$strings, baseStrings);
                    (_template$keys = template.keys).push.apply(_template$keys, baseKeys);
                } else {
                    template.strings.push(string);
                    template.keys.push(key);
                }
            });
            return this;
        };

        Style.prototype.updateDynamicDecls = function updateDynamicDecls(styleProps, props) {
            var _Style$template = Style.template,
                strings = _Style$template.strings,
                keys = _Style$template.keys;

            var updated = false;
            this.dynamicDecls.forEach(function (_ref) {
                var node = _ref[0],
                    string = _ref[1],
                    matches = _ref[2];

                matches.forEach(function (match) {
                    var key = keys[match];
                    var value = void 0;
                    if (typeof key === 'string') {
                        value = styleProps[key];
                        if (value === undefined) {
                            value = props[key];
                        }
                    } else if (typeof key === 'function') {
                        value = key(styleProps, props);
                    }
                    if (value === undefined) {
                        value = "";
                    }
                    string = string.replace('`' + match + '`', value);
                });
                if (node.value !== string) {
                    updated = true;
                    node.value = string;
                }
            });
            return updated;
        };

        Style.prototype.updateClassName = function updateClassName(className) {
            if (this.root.nodes[0].selector.indexOf(className) < 0) {
                this.root.nodes[0].selector = className;
                return true;
            }
            return false;
        };

        Style.prototype.renderTextContent = function renderTextContent(props) {
            var _ref2 = props || this.props,
                styleProps = _ref2.styleProps,
                other = _objectWithoutProperties(_ref2, ['styleProps']);

            var className = '.' + (other.className || '');
            var updated = [this.updateClassName(className), this.updateDynamicDecls(styleProps, other)];
            if (updated.some(Boolean)) {
                var result = this.root.toResult();
                (0, _postcssDiscardEmpty2.default)()(this.root, result);
                (0, _postcssNested2.default)()(this.root, result);
                (0, _autoprefixer2.default)()(this.root, result);
                this.textContent = this.root.toResult().css;
            }
            return this.textContent;
        };

        Style.prototype.render = function render() {
            return _react2.default.createElement(
                'style',
                { scoped: true },
                this.renderTextContent()
            );
        };

        return Style;
    }(StyleBase), _class.textContent = null, _class.template = {
        strings: [],
        keys: []
    }, _class.root = null, _temp;
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _postcssNested = require('postcss-nested');

var _postcssNested2 = _interopRequireDefault(_postcssNested);

var _postcssDiscardEmpty = require('postcss-discard-empty');

var _postcssDiscardEmpty2 = _interopRequireDefault(_postcssDiscardEmpty);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

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

var DYNAMIC_DECL_REGEX = /\`\d*\`/g;
var POSTCSS = (0, _postcss2.default)();

var StyleBase = function (_React$Component) {
    _inherits(StyleBase, _React$Component);

    function StyleBase() {
        _classCallCheck(this, StyleBase);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    return StyleBase;
}(_react2.default.Component);

function objectValues(object) {
    return Object.keys(object).map(function (key) {
        return object[key];
    });
}

function isPropType(obj) {
    return obj.name === 'bound checkType';
}

module.exports = exports['default'];