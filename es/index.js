var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { PropTypes } from 'react';
import shortid from 'shortid';
import classnames from 'classnames';
import Scope from './Scope';
import Style, { css } from './Style';
import Template from './Template';

export { css };

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
        if (Style.textContent instanceof Template) {
            var text = this.textContent.tag();
            Style.preprocess(text);
        }
        var stylePropKeys = Object.keys(Style.propTypes);
        var StyleScopedComponent = (_temp = _class = function (_StyleScope) {
            _inherits(StyleScopedComponent, _StyleScope);

            function StyleScopedComponent(props) {
                _classCallCheck(this, StyleScopedComponent);

                var _this2 = _possibleConstructorReturn(this, _StyleScope.call(this, props));

                _this2.uid = 'scope-' + shortid.generate();
                return _this2;
            }

            StyleScopedComponent.prototype.render = function render() {
                var styleProps = pick(this.props, stylePropKeys);
                var props = omit(this.props, stylePropKeys);
                var className = classnames(this.uid, this.props.className);
                return React.createElement(
                    Scope,
                    { className: className },
                    React.createElement(Style, _extends({}, props, { styleProps: styleProps, className: className })),
                    React.createElement(_Component, props)
                );
            };

            return StyleScopedComponent;
        }(StyleScope), _class.defaultProps = _extends({}, Style.defaultProps, _Component.defaultProps || {}), _class.propTypes = _extends({}, Style.propTypes, _Component.propTypes || {}), _temp);

        return StyleScopedComponent;
    };

    return StyleScope;
}(Style);

export { StyleScope as default };