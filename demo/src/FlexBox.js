
import React, {PropTypes} from 'react'
import Style from '../../src';

const DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse'];
const WRAP = ['nowrap', 'wrap', 'wrap-reverse'];

function flexPrefix(prop){
  return (props) => {
    const value = props[prop];
    if (value === 'start' || value === 'end'){
      return `flex-${value}`;
    }
    return value;
  };
}

function flexDirection(props) {
  if (props.column) {
    return "column"
  } else if (props.row) {
    return "row"
  }
  return ""
}


function flexWrap(props) {
  if (props.noWrap) {
    return "nowrap"
  } else if (props.wrap) {
    return "wrap"
  } else if (props.wrapReverse) {
    return "wrap-reverse";
  }
}

export class FlexBoxStyle extends Style() {

  static propTypes = {
    margin: PropTypes.string,
    marginTop: PropTypes.string,
    marginBottom: PropTypes.string,
    marginLeft: PropTypes.string,
    marginRight: PropTypes.string,
    padding: PropTypes.string,
    paddingTop: PropTypes.string,
    paddingRight: PropTypes.string,
    paddingBottom: PropTypes.string,
    paddingLeft: PropTypes.string,
    flex: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    minWidth: PropTypes.string,
    minHeight: PropTypes.string,
    grow: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    shrink: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    basis: PropTypes.string,
    row: PropTypes.bool,
    rowReverse: PropTypes.bool,
    column: PropTypes.bool,
    columnReverse: PropTypes.bool,
    noWrap: PropTypes.bool,
    wrap: PropTypes.bool,
    wrapReverse: PropTypes.bool,
    flow: PropTypes.oneOfType([PropTypes.oneOf(DIRECTIONS), PropTypes.oneOf(WRAP)]),
    justifyContent: PropTypes.oneOf(['start', 'end', 'center', 'space-between', 'space-around']),
    alignItems: PropTypes.oneOf(['start', 'end', 'center', 'baseline', 'stretch']),
    alignContent: PropTypes.oneOf(['start', 'end', 'center', 'space-between', 'space-around', 'stretch']),
    order: PropTypes.number,
    alignSelf: PropTypes.oneOf(['start', 'end', 'center', 'baseline', 'stretch']),
  };

  static textContent = Style.template`
        display: flex;
        box-sizing: border-box;
        padding: ${'padding'};
        padding-top: ${'paddingTop'};
        padding-right: ${'paddingRight'};
        padding-bottom: ${'paddingBottom'};
        padding-left: ${'paddingLeft'};
        margin: ${'margin'};
        margin-top: ${'marginTop'};
        margin-bottom: ${'marginBottom'};
        margin-left: ${'marginLeft'};
        margin-right: ${'marginRight'};
        width: ${'width'};
        height: ${'height'};
        min-width: ${'minWidth'};
        min-height: ${'minHeight'};
        flex-grow: ${(props) => (props.grow !== undefined && (props.grow | 0) || '')};
        flex-shrink: ${(props) => (props.shrink !== undefined && (props.shrink | 0) || '')};
        flex-basis: ${'basis'};
        flex-direction: ${flexDirection};
        flex-wrap: ${flexWrap};
        justify-content: ${flexPrefix('justifyContent')};
        align-content: ${flexPrefix('alignContent')};
        align-items: ${flexPrefix('alignItems')};
        order: ${'order'};
        align-self: ${flexPrefix('alignSelf')};
    `;
}

export default FlexBoxStyle.Component(
  class FlexBox extends React.Component {
    render() {
      return <div>{this.props.children}</div>
    }
  }
)
