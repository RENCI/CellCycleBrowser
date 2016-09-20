var React = require("react");
var PropTypes = React.PropTypes;

function option(option, i) {
  return (
    <option
      key={i}
      value={option.value}>
        {option.name}
    </option>
  );
}

var selectStyle = {
  minWidth: 0,
  width: "auto",
  display: "inline"
};

function ItemSelect(props) {
  return (
    <div>
      <span className="lead">
        {props.label}
      </span>
      <select
        className="form-control"
        style={selectStyle}
        onChange={props.onChange}>
          {props.options.map(option)}
      </select>
    </div>
  );
}

ItemSelect.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired
};

ItemSelect.defaultProps = {
  label: ""
};

module.exports = ItemSelect;
