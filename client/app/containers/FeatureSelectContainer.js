var React = require("react");
var FeatureStore = require("../stores/FeatureStore");
var ItemSelect = require("../components/ItemSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

// Retrieve the current state from the store
function getStateFromStore() {
  return {
    featureList: FeatureStore.getFeatureList(),
    feature: FeatureStore.getFeature()
  };
}

// Use index for value to ensure unique values
var featureOption = function (feature, i) {
  return {
    value: i.toString(),
    name: feature
  };
}

function featureValue(feature, featureList) {
  return featureList.indexOf(feature).toString();
}

var FeatureSelectContainer = React.createClass ({
  getInitialState: function () {
    return getStateFromStore();
  },
  componentDidMount: function () {
    FeatureStore.addChangeListener(this.onFeatureChange);
  },
  componentWillUnmount: function () {
    FeatureStore.removeChangeListener(this.onFeatureChange);
  },
  onFeatureChange: function () {
    this.setState(getStateFromStore);
  },
  handleChangeFeature: function (value) {
    ViewActionCreators.selectFeature(+value);
  },
  render: function () {
    return (
      <ItemSelect
        label="Feature: "
        options={this.state.featureList.map(featureOption)}
        activeValue={featureValue(this.state.feature, this.state.featureList)}
        onChange={this.handleChangeFeature} />
    );
  }
});

module.exports = FeatureSelectContainer;
