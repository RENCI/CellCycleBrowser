var React = require("react");
var PropTypes = React.PropTypes;
var CellDataSelectContainer = require("../containers/CellDataSelectContainer");
var FeatureSelectContainer = require("../containers/FeatureSelectContainer");
var AlignmentSelectContainer = require("../containers/AlignmentSelectContainer");
var SliderContainer = require("../containers/SliderContainer");
var ViewActionCreators = require("../actions/ViewActionCreators");

var divStyle = {
  display: "inline-block",
  verticalAlign: "top",
  marginLeft: 20,
  marginRight: 20,
  marginTop: 5,
  marginBottom: 20
};

function handlePhaseOverlayOpacityChange(value) {
  ViewActionCreators.changePhaseOverlayOpacity(value);
}

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
          <SliderContainer
            label={"Phase overlay opacity"}
            min={0}
            max={1}
            step={0.1}
            initialValue={0.5}
            onChange={handlePhaseOverlayOpacityChange} />
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
