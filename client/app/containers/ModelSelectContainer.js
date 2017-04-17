var React = require("react");
var ModelStore = require("../stores/ModelStore");
var ItemSelect = require("../components/ItemSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

// Retrieve the current state from the store
function getStateFromStore() {
  return {
    modelList: ModelStore.getModelList(),
    modelValue: ModelStore.getModelIndex().toString()
  };
}

// Use index for value to ensure unique values
function modelOption(model, i) {
  return {
    value: i.toString(),
    name: model.name,
    description: model.description
  };
}

var ModelSelectContainer = React.createClass ({
  getInitialState: function () {
    return getStateFromStore();
  },
  componentDidMount: function () {
    ModelStore.addChangeListener(this.onModelChange);
  },
  componentWillUnmount: function () {
    ModelStore.removeChangeListener(this.onModelChange);
  },
  onModelChange: function () {
    this.setState(getStateFromStore());
  },
  handleChangeModel: function (value) {
    ViewActionCreators.selectModel(+value);
  },
  render: function () {
    return (
      <ItemSelect
        label="Model: "
        options={this.state.modelList.map(modelOption)}
        activeValue={this.state.modelValue}
        onChange={this.handleChangeModel} />
    );
  }
});

module.exports = ModelSelectContainer;
