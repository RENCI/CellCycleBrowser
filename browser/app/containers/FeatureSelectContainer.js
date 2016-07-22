var React = require("react");
var PropTypes = React.PropTypes;
var ItemSelect = require("../components/ItemSelect");

var featureOption = function (feature, i) {
  return {
    value: i,
    name: feature.name
  };
}

var FeatureSelectContainer = React.createClass ({
  propTypes: {
    featureList: PropTypes.arrayOf(React.PropTypes.object).isRequired,
    onChange: PropTypes.func.isRequired
  },
  render: function () {
    return (
      <ItemSelect
        label="Feature: "
        options={this.props.featureList.map(featureOption)}
        onChange={this.props.onChange} />
    );
  }
});

module.exports = FeatureSelectContainer;
