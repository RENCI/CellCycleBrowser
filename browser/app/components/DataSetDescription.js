var React = require("react");
var PropTypes = React.PropTypes;

function DataSetDescription(props) {
  return <div>{props.description}</div>
}

DataSetDescription.propTypes = {
  description: PropTypes.string.isRequired
};

module.exports = DataSetDescription;
