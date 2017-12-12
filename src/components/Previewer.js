import React, { Component } from 'react';

class Previewer extends Component {

  handleOutsideClick = (evt) => {
    if (evt.target.classList.contains('Previewer')) {
      this.props.closePreviewer();
    }
  }

  render() {
    const previewerClassName = this.props.display ? 'Previewer' : 'hide';
    return (
      <div
        className={previewerClassName}
        onClick={(evt) => this.handleOutsideClick(evt)}
      >
        <div
          className="modal"
        >
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Previewer;
