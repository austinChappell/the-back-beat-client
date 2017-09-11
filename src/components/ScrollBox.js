import React, { Component } from 'react';
import { connect } from 'react-redux';

class ScrollBox extends Component {
  render() {
    return (
      <div className="ScrollBox">

          <h2>{this.props.title}</h2>
          <ul>
            {this.props.data.map((item, i) => {
              return (
                <li>
                  <h3>{item.title}</h3>
                  <p>{item.details}</p>
                </li>
              )
            })}
          </ul>

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

export default connect(mapStateToProps, mapDispatchToProps)(ScrollBox);
