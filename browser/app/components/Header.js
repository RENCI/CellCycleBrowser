var React = require("react");
var PropTypes = React.PropTypes;

function option(d, i) {
  return <option
           key={i}
           value={d.value}>
             {d.name}
         </option>
}

var minWidth = {
  minWidth: 0,
  width: "auto",
  display: "inline"
};

function Header(props) {
  return (
    <div className="jumbotron col-sm-12 text-center">
      <h1>{props.header}</h1>
      <div>
        <h2>Cell line:</h2>
        <select
          className="form-control"
          style={minWidth}
          onChange={props.onChangeCellLine}>
            {props.cellLines.map(option)}
        </select>
      </div>
    </div>
  );
}

Header.propTypes = {
  header: PropTypes.string.isRequired,
  cellLines: PropTypes.array.isRequired,
  onChangeCellLine: PropTypes.func.isRequired
};

module.exports = Header;
