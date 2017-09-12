import React, { Component } from 'react';
import { connect } from 'react-redux';

class ProfileInfoNavBar extends Component {
  render() {
    return (
      <div className="ProfileInfoNavBar">
        <div onClick={(evt) => this.props.changeProfileContent(evt, 'main')} className="tab">Info</div>
        <div onClick={(evt) => this.props.changeProfileContent(evt, 'events')} className="tab">Events</div>
        <div onClick={(evt) => this.props.changeProfileContent(evt, 'connections')} className="tab">Connections</div>
        <div onClick={(evt) => this.props.changeProfileContent(evt, 'bands')} className="tab">Bands</div>
        <div onClick={(evt) => this.props.changeProfileContent(evt, 'uploads')} className="tab">Uploads</div>
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
    changeProfileContent: (value) => {
      let newElem = evt.target;
      const action = { type: 'CHANGE_PROFILE_CONTENT', value, newElem };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfoNavBar);
