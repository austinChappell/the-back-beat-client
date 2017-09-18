import React, { Component } from 'react';

class ConnectResults extends Component {
  render() {

    let searchResults;

    if (this.props.data.length === 0) {
      searchResults = null;
    } else if (this.props.category === 'searchusernames') {
      searchResults = this.props.data.map((user) => {
        return (
          <div className="single-search-result">
            <h2>{user.first_name} {user.last_name} - {user.city}</h2>
          </div>
        )
      });
    } else if (this.props.category === 'searchbands') {
      searchResults = this.props.data.map((band) => {
        return (
          <div className="single-search-result">
            <h2>{band.band_name} - {band.band_city}</h2>
          </div>
        )
      });
    }

    return (
      <div className="ConnectResults">
        {searchResults}
      </div>
    )
  }
}

export default ConnectResults;
