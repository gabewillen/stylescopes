import React from 'react'
import {render} from 'react-dom'

import StyleScope from '../../src'


const DemoStyle = StyleScope()
    .css`
  background-color: blue;
  height: 100%;
  &.foo {
    color: red;
  }
`;


const Button = StyleScope(
    {
        backgroundColor: React.PropTypes.string
    }
).css`
    background-color: ${'backgroundColor'};
`.embed(function Button(props) {
    return <div {...props}>
        BUTTON
    </div>
});


const Demo = DemoStyle.embed(
    class Demo extends React.Component {
        render() {
            const state = this.state || {clicked: false};
            console.log('rendering demo', state);

            return <div>
                <Button backgroundColor={state.clicked ? 'yellow' : 'white'} onClick={() => this.setState({clicked: !state.clicked})}/>
                hello
                <div>foo</div>
            </div>
        }
});



render(<Demo/>, document.querySelector('#demo'));
