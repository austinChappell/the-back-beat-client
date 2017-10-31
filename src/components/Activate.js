import React, { Component } from 'react';
import { connect } from 'react-redux';

class Activate extends Component {

  state = {
    activated: false,
    message: 'Activating Your Account...'
  }

  componentDidMount() {
    this.activateAccount();
  }

  activateAccount = () => {
    const activationKey = this.props.match.params.activationKey;
    const apiURL = this.props.apiURL;
    const username = this.props.match.params.username;

    fetch(`${apiURL}/api/activate`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        activationKey,
        username
      })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      if (results.rows[0]) {
        if (results.rows[0].is_active === true) {
          this.setState({ activated: true, message: 'Your account has been activated! We are redirecting you to the login page...' }, () => {
            setTimeout(() => {
              this.props.history.push('/');
            }, 2000);
          });
        }
      } else {
        this.setState({ message: 'Oops! Something went wrong. Please try again later or contact us if this props persists.'});
      }
    })
  }

  render() {
    return (
      <div>
        <h1>{this.state.message}</h1>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL
  }
}

export default connect(mapStateToProps)(Activate);
