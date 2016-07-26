var React = require("react");
var PropTypes = React.PropTypes;

var style = {
  marginTop: 10
};

function DataSetDescription(props) {
  return <div style={style}>{props.description}</div>
}

DataSetDescription.propTypes = {
  description: PropTypes.string.isRequired
};

module.exports = DataSetDescription;
