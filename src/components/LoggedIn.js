import React, { Component } from 'react';

class LoggedIn extends Component {

  constructor() {
    super();

    this.state = {
      stuff: {}
    }
  }

  componentDidMount() {
    fetch('http://localhost:6001').then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ stuff: results });
    });
  };

  render() {
    return (
      <div className="LoggedIn" style={{ 'color': 'black' }}>
        stuff goes here
        {this.state.stuff.name}
      </div>
    )
  }
}

export default LoggedIn;
