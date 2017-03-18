function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

var Scope = function (_React$Component) {
    _inherits(Scope, _React$Component);

    function Scope() {
        _classCallCheck(this, Scope);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    Scope.prototype.render = function render() {
        return React.createElement(
            'div',
            { className: this.props.className },
            this.props.children
        );
    };

    return Scope;
}(React.Component);

export { Scope as default };