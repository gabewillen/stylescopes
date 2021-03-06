var _class, _temp;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import postcssNested from 'postcss-nested';
import postcss from 'postcss';
import Template from './Template';
import postcssDiscardEmpty from 'postcss-discard-empty';
import autoprefixer from 'autoprefixer';

var DYNAMIC_DECL_REGEX = /\`\$\d*\`/g;

var StyleElement = (_temp = _class = function (_React$Component) {
    _inherits(StyleElement, _React$Component);

    function StyleElement(props) {
        _classCallCheck(this, StyleElement);

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

    StyleElement.preprocess = function preprocess(textContent) {
        this.tree = postcss().process('.{' + textContent + '}').root;
    };

    StyleElement.prototype.updateClassName = function updateClassName(className) {
        if (this.tree.nodes[0].selector.indexOf(className) < 0) {
            this.tree.nodes[0].selector = className;
            return true;
        }
        return false;
    };

    StyleElement.prototype.updateDynamicDecl = function updateDynamicDecl(styleProps, props) {
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

    StyleElement.prototype.renderTextContent = function renderTextContent() {
        var _props = this.props,
            styleProps = _props.styleProps,
            other = _objectWithoutProperties(_props, ['styleProps']);

        var className = '.' + (other.className.split(' ').join('.') || '');
        var updated = [this.updateClassName(className), this.updateDynamicDecl(styleProps, other)];
        if (updated.some(Boolean)) {
            var result = this.tree.toResult();
            postcssDiscardEmpty()(this.tree, result);
            postcssNested()(this.tree, result);
            autoprefixer()(this.tree, result);
            this.textContent = this.tree.toResult().css;
        }
        return this.textContent;
    };

    StyleElement.prototype.render = function render() {
        return React.createElement(
            'style',
            { scoped: true },
            this.renderTextContent()
        );
    };

    return StyleElement;
}(React.Component), _class.defaultProps = {}, _class.type = "text/css", _class.textContent = new Template(), _class.tree = null, _temp);
export { StyleElement as default };
process.env.NODE_ENV !== "production" ? StyleElement.propTypes = {} : void 0;