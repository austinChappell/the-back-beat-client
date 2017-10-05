import React, { Component } from 'react';

class TextArea extends Component {
  render() {
    return (
      <div className="TextArea">
        <textarea
          name={this.props.name}
          placeholder={this.props.placeholder}
          onBlur={this.props.onBlur}
          onChange={(evt) => this.props.onChange(evt, this.props.name)}
          onFocus={this.props.onFocus}
          rows={this.props.rows}
          value={this.props.value}
        >
        </textarea>
      </div>
    )
  }
}

export default TextArea
