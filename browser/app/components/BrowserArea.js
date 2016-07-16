var React = require("react");
var PropTypes = React.PropTypes;
var BrowserVisualizationContainer = require("../containers/BrowserVisualizationContainer");

function BrowserArea(props) {
  return (
    <div>
      <h2>Browser</h2>
      <BrowserVisualizationContainer data={props.data} />
    </div>
  );
}

propTypes = {
  data: PropTypes.array.isRequired
};

module.exports = BrowserArea;
