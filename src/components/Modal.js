import React, { Component } from 'react';

class Modal extends Component {

  render() {
    return (
      <div className="Modal" style={{display: this.props.displayModal ? 'block' : 'none'}}>

        <div className="exit-button-div">
          <i
            id="exit-button"
            className="fa fa-times"
            onClick={this.props.exitClick}
            aria-hidden="true"></i>
        </div>

        <form className="full-background">

          {this.props.children}

        </form>

      </div>
    )
  }
}

export default Modal;
