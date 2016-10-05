var React = require("react");
var SliderContainer = require("../containers/SliderContainer");

function testSlider(value) {
  console.log(value);
}

function Controls(props) {
  return (
    <div className="form-group">
      <SliderContainer
        onChange={testSlider}/>
    </div>
  );
}

module.exports = Controls;
