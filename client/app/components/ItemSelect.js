var React = require("react");
var PropTypes = React.PropTypes;

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
    var option = props.options.filter(function(d) {
      return d.value === data.value;
    })[0];

    props.onChange(option);
  }

  return (
    <div className="dropdown" style={dropdownStyle}>
      <span className="lead">
        {props.label}
      </span>
      <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
        {props.activeOption.name + " "}
        <span className="caret"></span>
      </button>
      <ul className="dropdown-menu dropdown-menu-center">
        {props.options.map(option)}
      </ul>
    </div>
  );
}

ItemSelect.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeOption: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = ItemSelect;
