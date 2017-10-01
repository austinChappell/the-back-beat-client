import React, { Component } from 'react';
import { connect } from 'react-redux';

import ConnectResults from './ConnectResults';

class ConnectPage extends Component {

  state = {
    searchValue: '',
    searchCategory: 'searchusernames',
    data: []
  }

  handleInputChange = (evt) => {
    const val = evt.target.value;
    this.setState({ searchValue: val }, () => {
      this.fetchData();
    });
  }

  handleSelectChange = (evt) => {
    const val = evt.target.value;
    this.setState({ searchCategory: val, searchValue: '', data: [] }, () => {
      this.fetchData();
    });
  }

  fetchData = () => {
    const val = this.state.searchValue;
    const cat = this.state.searchCategory;
    const url = this.props.apiURL;
    fetch(`${url}/api/${cat}/${val}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({data: results.rows});
    })
  }

  render() {
    console.log('DATA IS', this.state.data);
    return (
      <div className="ConeectPage">
        <input type="text" value={this.state.searchValue} onChange={(evt) => this.handleInputChange(evt)} />
        <select onChange={this.handleSelectChange}>
          <option value="searchusernames">People</option>
          <option value="searchbands">Bands</option>
        </select>
        <ConnectResults data={this.state.data} category={this.state.searchCategory} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL
  }
}

export default connect(mapStateToProps)(ConnectPage);
