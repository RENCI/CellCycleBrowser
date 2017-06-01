var React = require("react");
var PropTypes = React.PropTypes;

function ItemSelect(props) {
  function option(option, i) {
    var starStyle = {
      marginRight: 5,
      visibility: option.starred ? null : "hidden"
    };

    var description = option.description ?
      <span className="small text-muted">{option.description}</span> :
      null;

    return (
      <li key={i}>
        <a
          href="#"
          data-name={option.name}
          data-value={option.value}
          onClick={handleClick}>
            {option.starred === undefined ? null :
              <span className="glyphicon glyphicon-star" style={starStyle}></span>}
            {option.name + (description ? ": " : "")} {description}
        </a>
      </li>
    );
  }

  function handleClick(e) {
    props.onChange(e.currentTarget.dataset.value);
  }

  var activeIndex = props.options.map(function(option) {
    return option.value;
  }).indexOf(props.activeValue);

  var activeName = activeIndex === -1 ? "" : props.options[activeIndex].name;

  return (
    <div>
      <strong>
        {props.label}
      </strong>
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-default dropdown-toggle"
          data-toggle="dropdown">
            {activeName} <span className="caret"></span>
        </button>
        <ul className="dropdown-menu dropdown-menu-form">
          {props.options.map(option)}
        </ul>
      </div>
    </div>
  );
}

ItemSelect.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = ItemSelect;
