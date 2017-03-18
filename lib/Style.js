'use strict';

exports.__esModule = true;
exports.default = undefined;

var _class, _temp;

exports.css = css;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _postcssNested = require('postcss-nested');

var _postcssNested2 = _interopRequireDefault(_postcssNested);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _Template = require('./Template');

var _Template2 = _interopRequireDefault(_Template);

var _postcssDiscardEmpty = require('postcss-discard-empty');

var _postcssDiscardEmpty2 = _interopRequireDefault(_postcssDiscardEmpty);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DYNAMIC_DECL_REGEX = /\`\$\d*\`/g;

function css(strings) {
    for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        keys[_key - 1] = arguments[_key];
    }

    return new _Template2.default(strings, strings.map(function (string, index) {
        return keys[index];
    }));
}

var Style = (_temp = _class = function (_React$Component) {
    _inherits(Style, _React$Component);

    function Style(props) {
        _classCallCheck(this, Style);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        if (_this.constructor.tree !== null) {
            _this.tree = _this.constructor.tree.clone();
            _this.dynamicDecls = [];
            _this.textContent = '';
            _this.tree.walkDecls(function (node) {
                var value = node.value;
                var matches = value.match(DYNAMIC_DECL_REGEX);
                if (matches) {
                    if (matches.length) {
                        _this.dynamicDecls.push([node, value, matches.map(function (match) {
                            return match.slice(2, -1);
                        })]);
                    }
                }
            });
        }

        return _this;
    }

    Style.preprocess = function preprocess(textContent) {
        this.tree = (0, _postcss2.default)().process('{ > *:not(style) {' + textContent + '} }').root;
    };

    Style.prototype.updateClassName = function updateClassName(className) {
        if (this.tree.nodes[0].selector.indexOf(className) < 0) {
            this.tree.nodes[0].selector = className;
            return true;
        }
        return false;
    };

    Style.prototype.updateDynamicDecl = function updateDynamicDecl(styleProps, props) {
        var _constructor$textCont = this.constructor.textContent,
            strings = _constructor$textCont.strings,
            keys = _constructor$textCont.keys;

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
                string = string.replace('`$' + match + '`', value);
            });
            if (node.value !== string) {
                updated = true;
                node.value = string;
            }
        });
        return updated;
    };

    Style.prototype.renderTextContent = function renderTextContent() {
        var _props = this.props,
            styleProps = _props.styleProps,
            other = _objectWithoutProperties(_props, ['styleProps']);

        var className = '.' + (other.className || '');
        var updated = [this.updateClassName(className), this.updateDynamicDecl(styleProps, other)];
        if (updated.some(Boolean)) {
            var result = this.tree.toResult();
            (0, _postcssDiscardEmpty2.default)()(this.tree, result);
            (0, _postcssNested2.default)()(this.tree, result);
            (0, _autoprefixer2.default)()(this.tree, result);
            this.textContent = this.tree.toResult().css;
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
}(_react2.default.Component), _class.defaultProps = {}, _class.type = "text/css", _class.textContent = new _Template2.default(), _class.tree = null, _temp);
exports.default = Style;
process.env.NODE_ENV !== "production" ? Style.propTypes = {} : void 0;