var React = require("react");
var ModelStore = require("../stores/ModelStore");
var ItemSelect = require("../components/ItemSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

function modelOption(model, i) {
  return {
    value: i,
    name: model.name
  };
}

function getStateFromStore() {
  return {
    modelList: ModelStore.getModelList()
  };
}

var ModelSelectContainer = React.createClass ({
  getInitialState: function () {
    return getStateFromStore();
  },
  componentDidMount: function () {
    ModelStore.addChangeListener(this.onModelListChange);
  },
  componentWillUnmount: function () {
    ModelStore.removeChangeListener(this.onModelListChange);
  },
  onModelListChange: function () {
    this.setState(getStateFromStore());
  },
  handleChangeModel: function (value) {
    ViewActionCreators.selectModel(value);
  },
  render: function () {
    return (
      <ItemSelect
        label="Model: "
        options={this.state.modelList.map(modelOption)}
        onChange={this.handleChangeModel} />
    );
  }
});

module.exports = ModelSelectContainer;
