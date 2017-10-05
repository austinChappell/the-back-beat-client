import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class GigBox extends Component {
  render() {
    return (
      <div className="GigBox">
        <h2>Upcoming Gigs</h2>
        <Link to="/gigs" className="see-all-link">see all</Link>
        {this.props.gigs.map((gig, index) => {
          return (
            <div key={index} className="gig">
              <h3>{gig.event_title}</h3>
              <h4>{gig.event_date_time}</h4>
              <p>{gig.event_details}</p>
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
    gigs: state.gigs
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GigBox);
