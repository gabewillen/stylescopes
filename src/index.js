import React, {PropTypes} from 'react'
import shortid from 'shortid'
import classnames from 'classnames'
import StyleElement from './StyleElement';
import Template from './Template';


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

function assign(target, ...sources) {
    for (let source of sources) {
        for (let key of Object.keys(source)) {
            if (!target.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}

class StyleScope extends React.Component {}

export default class Style {

    static template = function(strings, ...keys){
        return new Template(strings, strings.map((string, index) => keys[index]))
    };

    call constructor(...styles){
        const _propTypes = assign({}, ...styles.map(base => base.propTypes || {}));
        const _defaultProps = assign({}, ...styles.map(base => base.defaultProps || {}));
        const _templates = styles.map(S => S.textContent);
        return class extends StyleElement {


            static set propTypes(propTypes) {
                Object.defineProperty(
                    this,
                    'propTypes',
                    {
                        value: assign(propTypes, _propTypes)
                    }

                )
            }

            static set defaultProps(defaultProps) {
                Object.defineProperty(
                    this,
                    'defaultProps',
                    {
                        value: assign(defaultProps, _defaultProps)
                    }
                )
            }
            static set textContent(content) {
                if (content instanceof Template) {
                    const templates = [..._templates, content];
                    Object.defineProperty(
                        this,
                        'textContent',
                        {
                            value: templates.reduce(
                                (template, t) => {
                                    template.keys.push(...t.keys);
                                    template.strings.push(...t.strings);
                                    return template;
                                }, new Template()
                            )
                        }
                    )

                }
            }
            static Component(Component) {
                const Style = this;
                const stylePropKeys = Object.keys(_propTypes);
                this.preprocess(this.textContent.tag());
                return class extends Component {
                    static Style = this;

                    _merge_styles(className, styleProps, props) {
                        let style = <Style {...props} className={className} styleProps={styleProps}/>;
                        props.children = React.Children.map(
                            props.children,
                            (child) => {
                                if (!child.type || !(child.type.prototype instanceof StyleElement) ) {
                                    return child
                                }
                                style = React.cloneElement(
                                    child,
                                    child.props,
                                    [style.props.children, child.props.children].join('\n')
                                );
                            }
                        );

                        return style;
                    }
                    constructor(props){
                        super(props);
                        this.uid = `${Component.name}Scope-${shortid.generate()}`;
                    }
                    render(){
                        const styleProps = pick(this.props, stylePropKeys);
                        const props = omit(this.props, [...stylePropKeys]);
                        const className = classnames(this.uid, this.props.className);
                        const style = this._merge_styles(className, styleProps, props);
                        const element = new Component(props).render();
                        return (
                            <element.type {...props} className={className}>
                                {style}
                                {element.props.children}
                            </element.type>
                        );
                    }
                }
            }
        }
    }
}



