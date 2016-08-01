var React = require("react");
var PropTypes = React.PropTypes;
var ItemSelect = require("../components/ItemSelect");
var ViewActionCreators = require("../actions/ViewActionCreators");

var modelOption = function (model, i) {
  return {
    value: i,
    name: model.name
  };
}

var ModelSelectContainer = React.createClass ({
  propTypes: {
    modelList: PropTypes.arrayOf(React.PropTypes.object).isRequired
  },
  handleChangeModel: function (e) {
    ViewActionCreators.selectModel(e.target.value);
  },
  render: function () {
    return (
      <ItemSelect
        label="Model: "
        options={this.props.modelList.map(modelOption)}
        onChange={this.handleChangeModel} />
    );
  }
});

module.exports = ModelSelectContainer;
