var React = require("react");
var PropTypes = require("prop-types");
var AlignmentSelect = require("../components/AlignmentSelect");
var AlignmentStore = require("../stores/AlignmentStore");
var ViewActionCreators = require("../actions/ViewActionCreators");

function getStateFromStore() {
  return {
    alignment: AlignmentStore.getAlignment()
  };
}

class AlignmentSelectContainer extends React.Component {
  constructor() {
    super();

    this.state = getStateFromStore();

    // Need to bind this to callback functions here
    this.onAlignmentChange = this.onAlignmentChange.bind(this);
  }

  componentDidMount() {
    AlignmentStore.addChangeListener(this.onAlignmentChange);
  }

  componentWillUnmount() {
    AlignmentStore.removeChangeListener(this.onAlignmentChange);
  }

  onAlignmentChange() {
    this.setState(getStateFromStore());
  }

  handleChangeAlignment(alignment) {
    ViewActionCreators.selectAlignment(alignment);
  }

  render() {
    return (
      <AlignmentSelect
        alignment={this.state.alignment}
        shiftRight={this.props.shiftRight}
        onClick={this.handleChangeAlignment} />
    );
  }
}

AlignmentSelectContainer.propTypes = {
  shiftRight: PropTypes.bool.isRequired
};

module.exports = AlignmentSelectContainer;
