var React = require("react");
var PropTypes = React.PropTypes;

function click(e) {
console.log(event.currentTarget.dataset.id);
console.log(this);
}

var dropdownStyle = {
  display: "inline-block"
};

function ItemSelect(props) {
  function option(option, i) {
    return (
      <li
        key={i}>
        <a
          href="#"
          //onClick={props.onChange}>
          data-name={option.name}
          data-value={option.value}
          onClick={handleClick}>
            {option.name + (option.description ? ": " + option.description : "")}
        </a>
      </li>
    );
  }

  function handleClick(e) {
    var data = e.currentTarget.dataset;
    // XXX: Move to stateful component to update text

    props.onChange(data.value)
  }

  return (
    <div className="dropdown" style={dropdownStyle}>
      <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
        {props.label + " "}
        <span className="caret"></span>
      </button>
      <ul className="dropdown-menu dropdown-menu-center">
        {props.options.map(option)}
      </ul>
    </div>
  );
}

/*
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
*/
ItemSelect.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired
};

ItemSelect.defaultProps = {
  label: ""
};

module.exports = ItemSelect;
