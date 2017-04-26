var React = require("react");
var PropTypes = React.PropTypes;
var SliderContainer = require("../containers/SliderContainer");
var ViewActionCreators = require("../actions/ViewActionCreators");

function handleShowPhaseOverlayChange(event) {
  ViewActionCreators.changeShowPhaseOverlay(event.target.checked);
}

function handlePhaseOverlayOpacityChange(value) {
  ViewActionCreators.changePhaseOverlayOpacity(value);
}

function BrowserControls(props) {
  return (
    <div>
      <div className="row">
        <div className="col-md-2 col-md-offset-2">
          <div className="checkbox">
            <label style={{marginTop: 24, width: "100%"}}>
              <input
                type="checkbox"
                onChange={handleShowPhaseOverlayChange} />
                  Show
            </label>
          </div>
        </div>
        <div className="col-md-8">
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
  timeExtent: PropTypes.arrayOf(PropTypes.number).isRequired
};

module.exports = BrowserControls;
