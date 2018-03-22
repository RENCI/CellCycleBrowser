var React = require("react");
var PropTypes = require("prop-types");

function handleClick(e) {
  // Prevent closing of dropdown
  e.stopPropagation();
}

function MultiSelect(props) {
  var numSelected = props.options.reduce(function (p, c) {
    return p + (c.selected ? 1 : 0);
  }, 0);

  function option(option, i) {
    var active = option.active === undefined || option.active;
    var disabled = !active ||
                   (option.selected && numSelected <= props.minSelected);
    var labelClass = active && option.selected ? null : "text-muted";

    return (
      <li key={i}>
        <a className="checkbox">
          <label className={labelClass}>
            <input
              type="checkbox"
              defaultChecked={option.selected}
              disabled={disabled}
              data-value={option.value}
              onChange={props.onChange} />
            {option.name}
          </label>
        </a>
      </li>
    );
  }

  // Label
  var label = props.labelStrong ?
              <strong>{props.label}</strong> :
              props.label;

  // Right align
  var dropDownClasses = "dropdown-menu dropdown-menu-form";

  if (props.rightAlign) dropDownClasses += " dropdown-menu-right";

  return (
    <div>
      {label}
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-default dropdown-toggle"
          data-toggle="dropdown"
          disabled={!props.enabled}>
            Select <span className="caret"></span>
        </button>
        <ul
          className={dropDownClasses}
          onClick={handleClick}>
            {props.options.map(option)}
        </ul>
      </div>
    </div>
  );
}

MultiSelect.propTypes = {
  label: PropTypes.string.isRequired,
  labelStrong: PropTypes.bool,
  rightAlign: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  enabled: PropTypes.bool,
  minSelected: PropTypes.number,
  onChange: PropTypes.func
};

MultiSelect.defaultProps = {
  labelStrong: true,
  rightAlign: false,
  enabled: true,
  minSelected: 0,
  onChange: function () {}
};

module.exports = MultiSelect;
