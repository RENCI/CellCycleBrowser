var React = require("react");
var PropTypes = React.PropTypes;

var style = {
  marginTop: 6
};

function ProfileDescription(props) {
  return <div style={style}>{props.description}</div>
}

ProfileDescription.propTypes = {
  description: PropTypes.string.isRequired
};

module.exports = ProfileDescription;
