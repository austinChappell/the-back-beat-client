import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class RehearsalBox extends Component {
  render() {
    return (
      <div className="RehearsalBox">
        <h2>Upcoming Rehearsals</h2>
        <Link to="/rehearsals" className="see-all-link">see all</Link>
        {this.props.rehearsals.map((rehearsal, index) => {
          return (
            <div key={index} className="rehearsal">
              <h3>{rehearsal.event_title}</h3>
              <h4>{rehearsal.event_date_time}</h4>
              <p>{rehearsal.event_location}</p>
              <hr />
            </div>
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    rehearsals: state.rehearsals
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RehearsalBox);
