import React from 'react';
import postcssNested from 'postcss-nested';
import postcss from 'postcss';
import Template from './Template';
import postcssDiscardEmpty from 'postcss-discard-empty'
import autoprefixer from 'autoprefixer'

const DYNAMIC_DECL_REGEX = /\`\$\d*\`/g;



export default class StyleElement extends React.Component {

    static propTypes = {};
    static defaultProps = {};
    static type = "text/css";
    static textContent = new Template();
    static tree = null;

    constructor(props) {
        super(props);
        if (this.constructor.tree !== null) {
            this.tree = this.constructor.tree.clone();
            this.dynamicDecls = [];
            this.textContent = '';
            this.tree.walkDecls(
                (node) => {
                    let value = node.value;
                    let matches = value.match(DYNAMIC_DECL_REGEX);
                    if (matches) {
                        if (matches.length) {
                            this.dynamicDecls.push([node, value, matches.map((match) => match.slice(2, -1))]);
                        }
                    }
                }
            );
        }

    }

    static preprocess(textContent) {
        this.tree = postcss().process(`.{${textContent}}`).root;
    }

    updateClassName(className) {
        if (this.tree.nodes[0].selector.indexOf(className) < 0) {
            this.tree.nodes[0].selector = className;
            return true;
        }
        return false;
    }

    updateDynamicDecl(styleProps, props){
        const {strings, keys} = this.constructor.textContent;
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
                        string = string.replace(`\`\$${match}\``, value);
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


    renderTextContent(){
        const {styleProps, ...other} = this.props;
        const className = `.${other.className.split(' ').join('.') || ''}`;
        const updated = [this.updateClassName(className), this.updateDynamicDecl(styleProps, other)];
        if (updated.some(Boolean)) {
            const result = this.tree.toResult();
            postcssDiscardEmpty()(this.tree, result);
            postcssNested()(this.tree, result);
            autoprefixer()(this.tree, result);
            this.textContent = this.tree.toResult().css;
        }
        return this.textContent;
    }

    render() {
        return <style scoped>{this.renderTextContent()}</style>;
    }
}