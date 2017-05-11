var React = require("react");
var PropTypes = React.PropTypes;
var ItemSelect = require("./ItemSelect");

var divStyle = {
  marginLeft: 5,
  textAlign: "right"
};

function CellDataSelect(props) {
  function option(option, i) {
    var description = option.data.description ?
      <span className="small text-muted">{option.data.description}</span> :
      null;

    var features = option.data.features.map(function (feature, i) {
      return (
        <li
          key={i}>
          <a
            href="#"
            data-name={feature}
            onClick={handleClick}>
              {feature}
          </a>
        </li>
      );
    });

    return (
      <div key={i} style={i === 0 ? null : {marginTop: 5}}>
          <form className="form-inline">
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-addon" id="sizing-addon2">
                  <div className="checkbox">
                    <input type="checkbox"/>
                  </div>
                </span>
                <label className="form-control">
                  {option.data.name + (description ? ":" : null)} {description}
                </label>
              </div>
            </div>
            <div className="form-group" style={divStyle}>
              <div className="btn-group">
                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                  Features <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                  {features}
                </ul>
              </div>
            </div>
            <div className="form-group" style={divStyle}>
              <a
                href={'/cell_data_meta/' + option.data.fileName + '/'}
                target="_blank">
                metadata
              </a>
            </div>
          </form>
      </div>
    );
/*
<a
  href="#"
  data-name={option.name}
  data-value={option.value}
  onClick={handleClick}>
    {option.name} {description}
</a>
*/
  }

  function handleClick(e) {
    console.log(e);
//    props.onChange(e.currentTarget.dataset.value);
  }

/*
  var activeIndex = props.options.map(function(option) {
    return option.value;
  }).indexOf(props.activeValue);

  var activeName = activeIndex === -1 ? "" : props.options[activeIndex].name;
*/

  return (
    <div>
      <button
        type="button"
        className="btn btn-default"
        data-toggle="popover"
        data-html="true"
        data-placement="bottom"
        data-popover-content="#a1">
        Cell Data Select <span className="caret"></span>
      </button>
      <div id="a1" className="hide container-fluid">
        {props.options.map(option)}
      </div>
    </div>
  );

/*
  return (
    <div>
      <strong>
        {"Cell Data: "}
      </strong>
      <div className="btn-group">
        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
          Select <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          {props.options.map(option)}
        </ul>
      </div>
    </div>
  );
*/

/*
<a
  style={{marginLeft: 20}}
  href={'/cell_data_meta/' + this.state.cellDataFileName + '/'}
  target="_blank">
  Cell data metadata
</a>
*/
}

CellDataSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired
};

module.exports = CellDataSelect;
