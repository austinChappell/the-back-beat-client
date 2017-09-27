import React, { Component } from 'react';
import { connect } from 'react-redux';

class FormSelect extends Component {
  render() {

    const options = this.props.options.map((option, index) => {
      return (
        <option key={index} value={option.value}>{option.text}</option>
      )
    })

    return (
      <div className="FormSelect">
        <select
          className="input"
          name={this.props.name}
          onBlur={this.props.onBlur}
          onChange={(evt) => this.props.onChange(evt, this.props.name)}
          onFocus={this.props.onFocus}
          value={this.props.value}
        >
          {options}
        </select>
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

export default connect(mapStateToProps, mapDispatchToProps)(FormSelect);
