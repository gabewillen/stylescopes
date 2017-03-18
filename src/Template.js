

export default class Template {

    constructor(strings=[], keys=[]) {
        this.strings = strings;
        this.keys = keys;
    }

    tag() {
        return this.strings.map(
            (string, index) => {
                let key = this.keys[index];
                if (key) {
                    return `${string} \`$${index}\``;
                }
                return string
            }
        ).join('').split('\n').map(
            (line) => {
                if (line.indexOf('{') >= 0 || line.indexOf('}') >= 0) {
                    return line.trim();
                } else {
                    return `    ${line.trim()}`;
                }
            }
        ).join('\n');
    }

}