function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Template = function () {
    function Template() {
        var strings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        _classCallCheck(this, Template);

        this.strings = strings;
        this.keys = keys;
    }

    Template.prototype.tag = function tag() {
        var _this = this;

        return this.strings.map(function (string, index) {
            var key = _this.keys[index];
            if (key) {
                return string + ' `$' + index + '`';
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

    return Template;
}();

export { Template as default };