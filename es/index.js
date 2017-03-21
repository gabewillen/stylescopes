var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { PropTypes } from 'react';
import shortid from 'shortid';
import classnames from 'classnames';
import StyleElement from './StyleElement';
import Template from './Template';

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

function assign(target) {
    for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        sources[_key - 1] = arguments[_key];
    }

    for (var _iterator = sources, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
        } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
        }

        var source = _ref;

        for (var _iterator2 = Object.keys(source), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray2) {
                if (_i2 >= _iterator2.length) break;
                _ref2 = _iterator2[_i2++];
            } else {
                _i2 = _iterator2.next();
                if (_i2.done) break;
                _ref2 = _i2.value;
            }

            var key = _ref2;

            if (!target.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}

var StyleScope = function (_React$Component) {
    _inherits(StyleScope, _React$Component);

    function StyleScope() {
        _classCallCheck(this, StyleScope);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    return StyleScope;
}(React.Component);

var Style = function () {
    var _class, _temp;

    var _Style = (_temp = _class = function Style() {
        _classCallCheck(this, Style);
    }, _class.template = function (strings) {
        for (var _len2 = arguments.length, keys = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            keys[_key2 - 1] = arguments[_key2];
        }

        return new Template(strings, strings.map(function (string, index) {
            return keys[index];
        }));
    }, _temp);

    var _StyleCall = function _StyleCall() {
        var _propTypes = assign.apply(undefined, [{}].concat(styles.map(function (base) {
            return base.propTypes || {};
        })));
        var _defaultProps = assign.apply(undefined, [{}].concat(styles.map(function (base) {
            return base.defaultProps || {};
        })));
        var _templates = styles.map(function (S) {
            return S.textContent;
        });
        return function (_StyleElement) {
            _inherits(_class2, _StyleElement);

            function _class2() {
                _classCallCheck(this, _class2);

                return _possibleConstructorReturn(this, _StyleElement.apply(this, arguments));
            }

            _class2.Component = function Component(_Component) {
                var _class3, _temp2;

                var Style = this;
                var stylePropKeys = Object.keys(_propTypes);
                this.preprocess(this.textContent.tag());
                return _temp2 = _class3 = function (_Component2) {
                    _inherits(_class3, _Component2);

                    _class3.prototype._merge_styles = function _merge_styles(className, styleProps, props) {
                        var style = React.createElement(Style, _extends({}, props, { className: className, styleProps: styleProps }));
                        props.children = React.Children.map(props.children, function (child) {
                            if (!child.type || !(child.type.prototype instanceof StyleElement)) {
                                return child;
                            }
                            style = React.cloneElement(child, child.props, [style.props.children, child.props.children].join('\n'));
                        });

                        return style;
                    };

                    function _class3(props) {
                        _classCallCheck(this, _class3);

                        var _this3 = _possibleConstructorReturn(this, _Component2.call(this, props));

                        _this3.uid = _Component.name + 'Scope-' + shortid.generate();
                        return _this3;
                    }

                    _class3.prototype.render = function render() {
                        var styleProps = pick(this.props, stylePropKeys);
                        var props = omit(this.props, [].concat(stylePropKeys));
                        var className = classnames(this.uid, this.props.className);
                        var style = this._merge_styles(className, styleProps, props);
                        var element = new _Component(props).render();
                        return React.createElement(
                            element.type,
                            _extends({}, props, { className: className }),
                            style,
                            element.props.children
                        );
                    };

                    return _class3;
                }(_Component), _class3.Style = this, _temp2;
            };

            _createClass(_class2, null, [{
                key: 'propTypes',
                set: function set(propTypes) {
                    Object.defineProperty(this, 'propTypes', {
                        value: assign(propTypes, _propTypes)
                    });
                }
            }, {
                key: 'defaultProps',
                set: function set(defaultProps) {
                    Object.defineProperty(this, 'defaultProps', {
                        value: assign(defaultProps, _defaultProps)
                    });
                }
            }, {
                key: 'textContent',
                set: function set(content) {
                    if (content instanceof Template) {
                        var templates = [].concat(_templates, [content]);
                        Object.defineProperty(this, 'textContent', {
                            value: templates.reduce(function (template, t) {
                                var _template$keys, _template$strings;

                                (_template$keys = template.keys).push.apply(_template$keys, t.keys);
                                (_template$strings = template.strings).push.apply(_template$strings, t.strings);
                                return template;
                            })
                        });
                    }
                }
            }]);

            return _class2;
        }(StyleElement);
    };

    var Style = function Style() {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
        }

        if (this instanceof Style) {
            return Reflect.construct(_Style, args);
        } else {
            return _StyleCall.apply(this, args);
        }
    };

    Style.__proto__ = _Style;
    return Style;
}();

export { Style as default };