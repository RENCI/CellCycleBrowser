var React = require("react");
var PropTypes = React.PropTypes;

function ProfileDescription(props) {
  return <div>{props.description}</div>
}

ProfileDescription.propTypes = {
  description: PropTypes.string.isRequired
};

module.exports = ProfileDescription;
