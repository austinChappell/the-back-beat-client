import React, { Component } from 'react';
import { connect } from 'react-redux';

import ConnectResults from './ConnectResults';

class SiteSearch extends Component {

  state = {
    searchValue: '',
    searchCategory: 'searchusernames',
    data: []
  }

  clearInput = () => {
    this.setState({searchValue: ''}, () => {
      setTimeout(() => {
        this.setState({ data: [] });
      }, 250);
    });
  }

  handleInputChange = (evt) => {
    const val = evt.target.value;
    this.setState({ searchValue: val }, () => {
      this.fetchData();
    });
  }

  fetchData = () => {
    const val = this.state.searchValue;
    const cat = this.state.searchCategory;
    const url = this.props.apiURL;
    if (val.length > 0) {

      fetch(`${url}/api/${cat}/${val}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        },
      }).then((response) => {
        return response.json();
      }).then((results) => {
        this.setState({ data: results.rows });
      })

    } else {
      this.setState({ data: [] });
    }
  }

  render() {
    return (
      <div className="SiteSearch">
        <input
          placeholder="Find Musicians..."
          value={this.state.searchValue}
          onChange={(evt) => this.handleInputChange(evt)}
          onBlur={this.clearInput}
        />
        <ConnectResults
          data={this.state.data}
          category={this.state.searchCategory}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteSearch);
