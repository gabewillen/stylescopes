import React, {PropTypes} from 'react'
import postcss from 'postcss'
import postcssNested from 'postcss-nested';
import postcssDiscardEmpty from 'postcss-discard-empty'
import autoprefixer from 'autoprefixer'
import shortid from 'shortid'
import classnames from 'classnames'

function omit(obj, keys) {
    return (Object.keys(obj) || []).reduce(
        (newObj, key) => {
            if (keys.indexOf(key) < 0) {
                newObj[key] = obj[key];
            }
            return newObj;
        }, {}
    )
}


function pick(obj, keys) {
    return (Object.keys(obj) || []).reduce(
        (newObj, key) => {
            if (keys.indexOf(key) >= 0) {
                newObj[key] = obj[key];
            }
            return newObj;
        }, {}
    )
}

const DYNAMIC_DECL_REGEX = /\`\d*\`/g;
const POSTCSS = postcss();

class StyleBase extends React.Component {
}

function objectValues(object) {
    return Object.keys(object).map(key => object[key]);
}

function isPropType(obj) {
    return obj.name === 'bound checkType';
}

export default function (stylePropTypes = {}, defaultStyleProps = {}) {
    if (!objectValues(stylePropTypes).every(isPropType)) {
        defaultStyleProps = stylePropTypes;
        stylePropTypes = {};
    }
    const stylePropKeys = Object.keys(stylePropTypes);
    return class Style extends StyleBase {

        static textContent = null;
        static template = {
            strings: [],
            keys: []
        };
        static root = null;

        constructor(props) {
            super(props);
            this.root = Style.root.clone();
            this.dynamicDecls = [];
            this.textContent = this.root.toResult().css;

            this.root.walkDecls(
                (node) => {
                    let value = node.value;
                    let matches = value.match(DYNAMIC_DECL_REGEX);
                    if (matches) {
                        if (matches.length) {
                            this.dynamicDecls.push([node, value, matches.map((match) => match.slice(1, -1))]);
                        }
                    }
                }
            );
        }


        static _preprocess() {
            // here we generate our postcss ast
            const css = this._tag(this.template.strings, ...this.template.keys);
            this.root = POSTCSS.process(`{ > *:last-child {${css}} }`).root;
        }

        static embed(Component) {
            Style._preprocess();
            return class ScopedStyle extends React.Component {

                static propTypes = {
                    ...stylePropTypes,
                    ...Component.propTypes
                };

                static defaultProps = {
                    ...defaultStyleProps,
                    ...Component.defaultProps
                };

                constructor(props) {
                    super(props);
                    this.uid = `scope-${shortid.generate()}`;
                }


                render() {
                    const styleProps = pick(this.props, stylePropKeys);
                    const props = omit(this.props, stylePropKeys);
                    const className = classnames(this.uid, props.className);
                    return (
                        <span className={className}>
                            <Style {...props} styleProps={styleProps} className={className}/>
                            <Component {...props}/>
                        </span>
                    )
                }

            }
        }

        static _tag(strings, ...keys) {
            return strings.map(
                (string, index) => {
                    let key = keys[index];
                    if (key) {
                        return `${string} \`${index}\``;
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

        static css(strings, ...keys) {
            const template = Style.template;
            strings.forEach(
                (string, index) => {
                    let key = keys[index];
                    if (!strings[index].trim() && key.prototype instanceof StyleBase) {
                        let [baseStrings, ...baseKeys] = key.template;
                        template.strings.push(...baseStrings);
                        template.keys.push(...baseKeys);
                    } else {
                        template.strings.push(string);
                        template.keys.push(key);
                    }
                });
            return this;
        }


        updateDynamicDecls(styleProps, props) {
            const {strings, keys} = Style.template;
            let updated = false;
            this.dynamicDecls.forEach(
                ([node, string, matches]) => {
                    matches.forEach(
                        (match) => {
                            let key = keys[match];
                            let value;
                            if (typeof key === 'string') {
                                value = styleProps[key];
                                if (value === undefined) {
                                    value = props[key];
                                }
                            } else if (typeof key === 'function') {
                                value = key(styleProps, props);
                            }
                            if (value === undefined) {
                                value = ""
                            }
                            string = string.replace(`\`${match}\``, value);
                        }
                    );
                    if (node.value !== string) {
                        updated = true;
                        node.value = string;
                    }
                }
            );
            return updated;
        }

        updateClassName(className) {
            if (this.root.nodes[0].selector.indexOf(className) < 0) {
                this.root.nodes[0].selector = className;
                return true;
            }
            return false;
        }

        renderTextContent(props) {
            const {styleProps, ...other} = props || this.props;
            const className = `.${other.className || ''}`;
            const updated = [this.updateClassName(className), this.updateDynamicDecls(styleProps, other)];
            if (updated.some(Boolean)) {
                const result = this.root.toResult();
                postcssDiscardEmpty()(this.root, result);
                postcssNested()(this.root, result);
                autoprefixer()(this.root, result);
                this.textContent = this.root.toResult().css;
            }
            return this.textContent;
        }



        render() {
            return <style scoped >
                {this.renderTextContent()}
            </style>;
        }


    };
}