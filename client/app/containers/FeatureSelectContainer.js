var React = require("react");
var PropTypes = React.PropTypes;
var ItemSelectContainer = require("./ItemSelectContainer");
var ViewActionCreators = require("../actions/ViewActionCreators");

var featureOption = function (feature, i) {
  return {
    value: i.toString(),
    name: feature
  };
}

var FeatureSelectContainer = React.createClass ({
  propTypes: {
    featureList: PropTypes.arrayOf(React.PropTypes.string).isRequired,
  },
  handleChangeFeature: function (value) {
    ViewActionCreators.selectFeature(value);
  },
  render: function () {
    return (
      <ItemSelectContainer
        label="Feature: "
        options={this.props.featureList.map(featureOption)}
        onChange={this.handleChangeFeature} />
    );
  }
});

module.exports = FeatureSelectContainer;
