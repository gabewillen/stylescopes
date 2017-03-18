import React, {PropTypes} from 'react'
import shortid from 'shortid'
import classnames from 'classnames'
import Scope from './Scope';
import Style, {css} from './Style';
import Template from './Template';

export {css} from './Style'


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




export default class StyleScope extends Style {


    static Component(Component) {
        const Style = this;
        if (Style.textContent instanceof Template) {
            const text = this.textContent.tag();
            Style.preprocess(text);
        }
        const stylePropKeys = Object.keys(Style.propTypes);
        return class extends StyleScope {

            static defaultProps = {...Style.defaultProps, ...(Component.defaultProps || {})};
            static propTypes = {...Style.propTypes, ...(Component.propTypes || {})};

            constructor(props) {
                super(props);
                this.uid = `scope-${shortid.generate()}`;
            }

            render() {
                const styleProps = pick(this.props, stylePropKeys);
                const props = omit(this.props, stylePropKeys);
                const className = classnames(this.uid, this.props.className);
                return (
                    <Scope className={className}>
                        <Style {...props} styleProps={styleProps} className={className}/>
                        <Component {...props}/>
                    </Scope>
                )
            }
        }
    }
}

