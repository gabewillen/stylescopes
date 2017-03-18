import React, {PropTypes} from 'react'
import {render} from 'react-dom'

import StyleScope, {css} from '../../src'
import {FlexStyle} from './Flex';

class AStyle extends StyleScope {
    static propTypes = {};

    static defaultProps = {
        fee: 'green'
    };

    static textContent = css`
        background-color: ${'fee'};
    `
}

class BStyle extends StyleScope {

    static defaultProps = {
        foo: 'blue'
    };

    static textContent = css`
    background-color: ${'foo'};
`
}


const Demo = FlexStyle.Component(
    AStyle.Component(
        BStyle.Component(
            class extends React.Component {
                render() {
                    return <div>
                        hello
                        <div>foo</div>
                    </div>
                }
            }
        )
    )
);


console.log(Demo.defaultProps);

render(<Demo/>, document.querySelector('#demo'));
