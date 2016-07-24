var React = require("react");
var PropTypes = React.PropTypes;
var CellDataSelectContainer = require("../containers/CellDataSelectContainer");
var FeatureSelectContainer = require("../containers/FeatureSelectContainer");

function BrowserControls(props) {
  return (
    <div>
      <CellDataSelectContainer
        cellDataList={props.cellDataList} />
      <FeatureSelectContainer
        featureList={props.featureList} />
    </div>
  );
}

BrowserControls.propTypes = {
  cellDataList: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  featureList: PropTypes.arrayOf(React.PropTypes.string).isRequired
};

module.exports = BrowserControls;
