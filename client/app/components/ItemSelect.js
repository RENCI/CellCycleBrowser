var React = require("react");
var PropTypes = React.PropTypes;

var dropdownStyle = {
  display: "inline-block"
};

function ItemSelect(props) {
  function option(option, i) {
    var name = option.description ?
      option.name + ":" :
      option.name;
      
    var desc = option.description ?
      <span className="small text-muted">{option.description}</span> :
      null;

    return (
      <li
        key={i}>
        <a
          href="#"
          data-name={option.name}
          data-value={option.value}
          onClick={handleClick}>
            {name} {desc}
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
    <div>
      <span className="lead">
        {props.label}
      </span>
      <div className="btn-group">
        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
          {props.activeOption.name} <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          {props.options.map(option)}
        </ul>
      </div>
    </div>
  );


  <div class="btn-group">
  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Action <span class="caret"></span>
  </button>
  <ul class="dropdown-menu">
    <li><a href="#">Action</a></li>
    <li><a href="#">Another action</a></li>
    <li><a href="#">Something else here</a></li>
    <li role="separator" class="divider"></li>
    <li><a href="#">Separated link</a></li>
  </ul>
</div>
}

ItemSelect.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeOption: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = ItemSelect;
