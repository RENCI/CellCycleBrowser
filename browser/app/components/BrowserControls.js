var React = require("react");
var PropTypes = React.PropTypes;
var CellDataSelectContainer = require("../containers/CellDataSelectContainer");
var FeatureSelectContainer = require("../containers/FeatureSelectContainer");

var divStyle = {
  display: "inline-block",
  marginTop: -10,
  marginLeft: 20,
  marginRight: 20
};

function BrowserControls(props) {
  return (
    <div>
      <div style={divStyle}>
        <CellDataSelectContainer
          cellDataList={props.cellDataList} />
      </div>
      <div style={divStyle}>
        <FeatureSelectContainer
          featureList={props.featureList} />
      </div>
    </div>
  );
}

BrowserControls.propTypes = {
  cellDataList: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  featureList: PropTypes.arrayOf(React.PropTypes.string).isRequired
};

module.exports = BrowserControls;
