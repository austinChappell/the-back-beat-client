import React, { Component } from 'react';
import { connect } from 'react-redux';

import ConnectResults from './ConnectResults';
import Modal from './Modal';

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

  goBack = () => {
    this.props.history.goBack();
  }

  render() {

    console.log('DATA IS', this.state.data);
    return (
      <div className="ConeectPage">
        <Modal displayModal={true} showExitButton={true} exitClick={this.goBack}>
          <input style={{width: '45%', marginRight: '10%'}} type="text" value={this.state.searchValue} onChange={(evt) => this.handleInputChange(evt)} />
          <select style={{width: '45%'}} onChange={this.handleSelectChange}>
            <option value="searchusernames">People</option>
            <option value="searchbands">Bands</option>
          </select>
          <ConnectResults data={this.state.data} category={this.state.searchCategory} />
        </Modal>
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
