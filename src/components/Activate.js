import React, { Component } from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';

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
          this.setState({ activated: true, message: 'Your account has been activated! We are redirecting you back to the login page...' }, () => {
            setTimeout(() => {
              this.props.history.push('/');
            }, 2000);
          });
        }
      } else {
        this.setState({ message: 'Oops! Something went wrong. Please try again later or contact us if this props persists. We are redirecting you back to the home page...'}, () => {
          setTimeout(() => {
            this.props.history.push('/');
          }, 2000);
        });
      }
    })
  }

  render() {
    return (
      <div>
        <Dialog
          modal={false}
          open={true}
        >
          <h2 style={{ fontWeight: '500', textAlign: 'center', lineHeight: '1.5em' }}>{this.state.message}</h2>
        </Dialog>
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
