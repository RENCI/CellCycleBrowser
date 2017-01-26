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

function handleShowPhaseOverlayChange(event) {
  ViewActionCreators.changeShowPhaseOverlay(event.target.checked);
}

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
        <div className="col-sm-2 col-sm-offset-2">
          <div className="checkbox">
            <label style={{marginTop: 24, width: "100%"}}>
              <input
                type="checkbox"
                onChange={handleShowPhaseOverlayChange} />
                  Show
            </label>
          </div>
        </div>
        <div className="col-sm-8">
          <SliderContainer
            label={"Phase overlay opacity"}
            min={0}
            max={1}
            step={0.1}
            initialValue={1}
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
