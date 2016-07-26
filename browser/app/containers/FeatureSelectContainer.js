var React = require("react");
var PropTypes = React.PropTypes;
var ItemSelect = require("../components/ItemSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

var featureOption = function (feature, i) {
  return {
    value: i,
    name: feature
  };
}

var FeatureSelectContainer = React.createClass ({
  propTypes: {
    featureList: PropTypes.arrayOf(React.PropTypes.string).isRequired,
  },
  handleChangeFeature: function (e) {
    ViewActionCreators.selectFeature(e.target.value);
  },
  render: function () {
    return (
      <ItemSelect
        label="Feature: "
        options={this.props.featureList.map(featureOption)}
        onChange={this.handleChangeFeature} />
    );
  }
});

module.exports = FeatureSelectContainer;
