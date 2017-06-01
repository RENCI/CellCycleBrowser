var React = require("react");
var ModelStore = require("../stores/ModelStore");
var ItemSelect = require("../components/ItemSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

// Retrieve the current state from the store
function getStateFromStore() {
  var model = ModelStore.getModel();
  var id = model.id ? model.id : "";

  return {
    modelList: ModelStore.getModelList(),
    modelId: id
  };
}

// Use index for value to ensure unique values
function modelOption(model) {
  return {
    value: model.id,
    name: model.name,
    description: model.description,
    starred: model.default
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
  handleChangeModel: function (id) {
    ViewActionCreators.selectModel(id);
  },
  render: function () {
    return (
      <ItemSelect
        label="Model: "
        options={this.state.modelList.map(modelOption)}
        activeValue={this.state.modelId}
        onChange={this.handleChangeModel} />
    );
  }
});

module.exports = ModelSelectContainer;
