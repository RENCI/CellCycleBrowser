var React = require("react");
var PropTypes = require("prop-types");

function WorkspaceDescription(props) {
  return <div>{props.description}</div>
}

WorkspaceDescription.propTypes = {
  description: PropTypes.string.isRequired
};

module.exports = WorkspaceDescription;
