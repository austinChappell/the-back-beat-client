import React, { Component } from 'react';

class Modal extends Component {

  render() {

    let exitButton = null;

    if (this.props.showExitButton) {
      exitButton = <div className="exit-button-div">
        <i
          id="exit-button"
          className="fa fa-times"
          onClick={this.props.exitClick}
          aria-hidden="true"></i>
      </div>
    }

    return (
      <div className="Modal" style={{display: this.props.displayModal ? 'block' : 'none'}}>

        {exitButton}

        <form className="full-background">

          {this.props.children}

        </form>

      </div>
    )
  }
}

export default Modal;
