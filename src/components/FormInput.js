import React, { Component } from 'react';
import { connect } from 'react-redux';

class FormInput extends Component {
  render() {
    return (
      <div className="FormInput">
        <input
          className="input"
          name={this.props.name}
          step={this.props.step}
          min={this.props.min}
          max={this.props.max}
          placeholder={this.props.placeholder}
          onBlur={this.props.onBlur}
          onChange={(evt) => this.props.onChange(evt, this.props.name)}
          onFocus={this.props.onFocus}
          value={this.props.value}
          type={this.props.type}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormInput);
