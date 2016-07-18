var React = require("react");
var PropTypes = React.PropTypes;
var Feature = require("../components/Feature");

function BrowserArea(props) {
  var features = props.features.map(function (feature, i) {
    return <Feature feature={feature} key={i} />
  });

  return (
    <div>
      <h2>Browser</h2>
        {features}
    </div>
  );
}

propTypes = {
  features: PropTypes.array.isRequired
};

module.exports = BrowserArea;
