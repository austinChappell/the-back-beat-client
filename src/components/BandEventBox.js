import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class BandEventBox extends Component {
  render() {

    let link = this.props.events.length > 0 ? <Link to={`/${this.props.type}s`} className="see-all-link">see all</Link> : null;

    let gigs = this.props.events.length > 0 ? this.props.events.map((event, index) => {

      let date = event.event_date_time;
      let formattedDate = String(new Date(date));
      let shortDate = `${formattedDate.slice(0, 10)}, ${formattedDate.slice(11, 15)}`;
      let hour = Number(formattedDate.slice(16, 18));
      let minute = formattedDate.slice(18, 21);
      let period = 'PM';
      let successColor = 'green';

      if (hour === 0) {
        hour = 12;
        period = 'AM';
      } else if (hour < 12) {
        period = 'AM';
      } else if (hour > 12) {
        hour = hour - 12;
      }

      let formattedTime = `${String(hour)}${minute} ${period}`;

      if (index < 3) {
        return (
          <div key={index} className="gig">
            <h3>{event.event_title}</h3>
            <h4>{shortDate} - {formattedTime}</h4>
            <p>{event.event_details}</p>
            <hr />
          </div>
        )
      }
    }) : <p>{`No ${this.props.type}s scheduled.`}</p>;

    return (
      <div className="BandEventBox">
        <h2>{this.props.title}</h2>
        {link}
        {gigs}
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

export default connect(mapStateToProps, mapDispatchToProps)(BandEventBox);
