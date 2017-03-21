import React, {PropTypes} from 'react';
import Style from '../../src';
import FlexBox from './FlexBox'

function fontWeight(props) {
  const {textNormal, textBold, textBolder, textLighter} = props;
  let value;
  if (textNormal) {
    value = "normal";
  } else if (textBold) {
    value = "bold";
  } else if (textBolder) {
    value = "bolder";
  } else if (textLighter) {
    value = "lighter";
  }
  return value;
}


export class LabelStyle extends Style(FlexBox.Style) {

  static propTypes = {
    fontSize: PropTypes.string,
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    textNormal: PropTypes.bool,
    textBold: PropTypes.bool,
    textBolder: PropTypes.bool,
    textLighter: PropTypes.bool
  };

  static defaultProps = {
    padding: '.5rem',
    backgroundColor: "darkgray",
    justifyContent: "center",
    textColor: "black"
  };

  static textContent = Style.template`
        font-size: ${'fontSize'};
        background-color: ${'backgroundColor'};
        color: ${'textColor'};
        font-weight: ${fontWeight};
    `

}


export default LabelStyle.Component(
    class Label extends React.Component {
      render() {
        return <label {...this.props} alignItems="center"/>
      }
    }
)
