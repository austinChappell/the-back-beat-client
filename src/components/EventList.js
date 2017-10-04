import React, { Component } from 'react';
import { connect } from 'react-redux';

class EventList extends Component {
  render() {

    this.props.data.sort((a, b) => {
      return a.event_date_time > b.event_date_time;
    })


    return (
      <div className="EventList">
        Event List Component
        {this.props.data.map((event, index) => {

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

          return (
            <div key={index} className="event">
              <div>
                <div>{shortDate}</div>
                <div>{formattedTime}</div>
              </div>
              <div>
                {event.event_title}
              </div>
            </div>
          )
        })}
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

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
