var React = require("react");
var PropTypes = React.PropTypes;

function WorkspaceDescription(props) {
  return <div>{props.description}</div>
}

WorkspaceDescription.propTypes = {
  description: PropTypes.string.isRequired
};

module.exports = WorkspaceDescription;
