var React = require("react");
var HeaderContainer = require("../containers/HeaderContainer");
var MainContainer = require("../containers/MainContainer");
var DataStore = require("../stores/DataStore");

function getDataState() {
  return {
    data: DataStore.getAll()
  };
}

var CellCycleBrowser = React.createClass({
  getInitialState: function () {
    return getDataState();
  },
  componentDidMount: function () {
    DataStore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function() {
    DataStore.removeChangeListener(this.onChange);
  },
  onChange: function () {
    this.setState(getDataState());
  },
  render: function () {
    return (
      <div>
        <HeaderContainer header="Cell Cycle Browser"/>
        <MainContainer />
      </div>
    );
  }
});

module.exports = CellCycleBrowser;
