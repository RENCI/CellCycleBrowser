var React = require("react");
var ModelStore = require("../stores/ModelStore");
var ItemSelectContainer = require("./ItemSelectContainer");
var ViewActionCreators = require("../actions/ViewActionCreators");

function modelOption(model, i) {
  return {
    value: i.toString(),
    name: model.name,
    description: model.description
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
      <ItemSelectContainer
        label="Model: "
        options={this.state.modelList.map(modelOption)}
        onChange={this.handleChangeModel} />
    );
  }
});

module.exports = ModelSelectContainer;
