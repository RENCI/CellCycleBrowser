var React = require('react');
var ReactDOM = require('react-dom');

var Hello = React.createClass({
  render: function () {
    return (
      <div>Cell Cycle Browser!</div>
    )
  }
});

ReactDOM.render(<Hello />, document.getElementById('app'));