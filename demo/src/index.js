import React, {PropTypes} from 'react'
import {render} from 'react-dom'
import Style from '../../src'
import FlexBox from './FlexBox'
import Label from './Label'

import tinycolor from 'tinycolor2'


function manipulate(method, value) {
    return function(props) {
        return tinycolor(props.backgroundColor)[method](value)
    };
}

function insetTop(props) {
    let backgroundColor = tinycolor(props.backgroundColor);
    return `inset 0 1px 0 ${backgroundColor.desaturate(20).darken(10)}`
}


function insetBottom(props) {
    let backgroundColor = tinycolor(props.backgroundColor);
    return `inset 0 -1px ${backgroundColor.saturate(10).lighten(10)}`
}

function inset(props) {
    let backgroundColor = tinycolor(props.backgroundColor);
    return `inset 0 0 0 1px ${backgroundColor.desaturate(10)}`
}

function computeBorder(props) {
    let backgroundColor = tinycolor(props.backgroundColor);
    return `1px solid ${backgroundColor.saturate(20).darken(10)}`
}


class ButtonStyle extends Style(Label.Style) {

    static propTypes = {
        backgroundColor: PropTypes.string
    };

    static defaultProps = {
        backgroundColor: "grey"
    };


    static textContent = Style.template`
        color: ${'textColor'};
        background-color: ${'backgroundColor'};
        transition: all 20ms ease-out;
        background-image: linear-gradient(to bottom, ${manipulate('lighten', 5)}, ${manipulate('darken', 10)});
        /*border: ${computeBorder};
        box-shadow: ${insetTop}, ${insetBottom}, ${inset}, 0 2px 4px rgba(0, 0, 0, .85); */
        &:active {
            background: ${manipulate('darken', 5)};
            
        }
        i {
            &:active {
                color: ${(props) => tinycolor(props.textColor).lighten(25)};

            }
        }
    `;
}

const Button = ButtonStyle.Component(
    class extends React.Component {
        render() {
            return <Label>
                {this.props.children}
            </Label>
        }
    }
);


class Demo extends React.Component {
    render(){
        return (
            <FlexBox>
                <Button textColor="white" backgroundColor="yellow">1</Button>
                <Button backgroundColor="pink">2</Button>
            </FlexBox>

        )
    }
}


render(<Demo/>, document.querySelector('#demo'));
