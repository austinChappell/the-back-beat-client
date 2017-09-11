import React, { Component } from 'react';
import { connect } from 'react-redux';

class LoggedIn extends Component {

  // componentDidMount() {
  //   fetch('http://localhost:6001').then((response) => {
  //     return response.json();
  //   }).then((results) => {
  //     this.setState({ stuff: results });
  //   });
  // };

  render() {
    console.log('LOGGED IN PROPS', this.props);
    return (
      <div className="LoggedIn" style={{ 'color': 'black' }}>
        <h1>Welcome, {this.props.currentUsername}. You are now logged in.</h1>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUsername: state.currentUsername
  }
}

export default connect(mapStateToProps)(LoggedIn);
