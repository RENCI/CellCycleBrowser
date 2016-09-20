var React = require("react");
var PropTypes = React.PropTypes;
var CellDataSelectContainer = require("../containers/CellDataSelectContainer");
var FeatureSelectContainer = require("../containers/FeatureSelectContainer");
var AlignmentSelectContainer = require("../containers/AlignmentSelectContainer")

var divStyle = {
  display: "inline-block",
  verticalAlign: "top",
  marginLeft: 20,
  marginRight: 20,
  marginTop: 5,
  marginBottom: 20
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
      <AlignmentSelectContainer />
    </div>
  );
}

BrowserControls.propTypes = {
  cellDataList: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  featureList: PropTypes.arrayOf(React.PropTypes.string).isRequired
};

module.exports = BrowserControls;
