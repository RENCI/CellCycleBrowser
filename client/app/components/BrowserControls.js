var React = require("react");
var PropTypes = React.PropTypes;
var CellDataSelectContainer = require("../containers/CellDataSelectContainer");
var FeatureSelectContainer = require("../containers/FeatureSelectContainer");
var AlignmentSelectContainer = require("../containers/AlignmentSelectContainer");
var TimeScaleContainer = require("../containers/TimeScaleContainer");

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
      <div className="row">
        <div className="col-sm-10 col-sm-offset-2">
          <TimeScaleContainer timeExtent={props.timeExtent} />
        </div>
      </div>
    </div>
  );
}

BrowserControls.propTypes = {
  cellDataList: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  featureList: PropTypes.arrayOf(React.PropTypes.string).isRequired,
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired
};

module.exports = BrowserControls;
