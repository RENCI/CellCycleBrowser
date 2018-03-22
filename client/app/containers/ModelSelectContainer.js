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

function modelOption(model) {
  return {
    value: model.id,
    name: model.name,
    description: model.description,
    fileName: model.fileName,
    starred: model.default
  };
}

class ModelSelectContainer extends React.Component {
  constructor() {
    super();

    this.state = getStateFromStore();

    // Need to bind this to callback functions here
    this.onModelChange = this.onModelChange.bind(this);
  }

  componentDidMount() {
    ModelStore.addChangeListener(this.onModelChange);
  }

  componentWillUnmount() {
    ModelStore.removeChangeListener(this.onModelChange);
  }

  onModelChange() {
    this.setState(getStateFromStore());
  }

  handleChangeModel(id) {
    ViewActionCreators.selectModel(id);
  }

  render() {
    // Add a None option
    var options = [{
      value: "",
      name: "None",
      starred: false
    }].concat(this.state.modelList.map(modelOption));

    return (
      <ItemSelect
        label="Model: "
        options={options}
        activeValue={this.state.modelId}
        onChange={this.handleChangeModel} />
    );
  }
}

module.exports = ModelSelectContainer;
