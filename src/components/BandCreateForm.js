import React, { Component } from 'react';
import { connect } from 'react-redux';

class BandCreateForm extends Component {

  state = {
    bandName: '',
    bandGenre: '',
    bandLevel: '',
    bandCity: '',
    searchMember: '',
    searchMemberResuts: []
  }

  handleInputChange = (evt, input) => {
    const updateStateObject = {};
    updateStateObject[input] = evt.target.value;
    this.setState(updateStateObject);
  }

  submitForm = (evt) => {
    evt.preventDefault();
    const url = this.props.apiURL;
    const formBody = {
      bandName: this.state.bandName,
      bandGenre: this.state.bandGenre,
      bandLevel: this.state.bandLevel,
      bandCity: this.state.bandCity
    };
    fetch(`${url}/band/create`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(formBody)
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({bandName: '', bandGenre: '', bandLevel: '', bandCity: ''});
      console.log('PROPS', this.props);
    }).catch((err) => {
      throw err;
    })
  }

  filterMembers = (evt) => {
    const value = evt.target.value;
    const url = this.props.apiURL;
    this.setState({searchMember: value}, () => {
      console.log('input changing');
      fetch(`${url}/api/searchusernames/${value}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        return response.json();
      }).then((results) => {
        console.log(results.rows);
        this.setState({searchMemberResuts: results.rows});
      })
    })
  }

  addMember = (evt, userId) => {
    console.log('User Id', userId);
  }

  render() {

    let searchResultsDisplay = this.state.searchMemberResuts.map((user) => {
      return (
        <div className="single-search-result" onClick={(evt) => this.addMember(evt, user.id)}>
          <h4>{user.first_name} {user.last_name} <span>{user.city}</span></h4>
        </div>
      )
    });

    if (this.state.searchMember.length === 0) {
      searchResultsDisplay = null
    } else if (this.state.searchMember.length > 0 && this.state.searchMemberResuts.length === 0) {
      searchResultsDisplay = <div className="no-results">
          <span>(No results)</span>
        </div>
    }

    return (
      <div className="BandCreateForm">
        <form>

          <div className="form-group">
            <label>Band Name:</label>
            <input name="name" value={this.state.bandName} onChange={(evt) => this.handleInputChange(evt, 'bandName')} />
          </div>

          <div className="form-group">
            <label>Genre:</label>
            <select name="genre" value={this.state.bandGenre} onChange={(evt) => this.handleInputChange(evt, 'bandGenre')}>
              <option value={null}>----</option>
              <option value="rock">Rock</option>
              <option value="jazz">Jazz</option>
              <option value="country">Country</option>
            </select>
          </div>

          <div className="form-group">
            <label>Skill Level:</label>
            <select name="level" value={this.state.bandLevel} onChange={(evt) => this.handleInputChange(evt, 'bandLevel')}>
              <option value={null}>----</option>
              <option value="pro">Professional</option>
              <option value="semi-pro">Semi-Professional</option>
              <option value="amateur">Amateur</option>
              <option value="novice">Novice</option>
            </select>
          </div>

          <div className="form-group">
            <label>City:</label>
            <select name="city" value={this.state.bandCity} onChange={(evt) => this.handleInputChange(evt, 'bandCity')}>
              <option value={null}>----</option>
              <option value="AustinTX">Austin, TX</option>
              <option value="DallasTX">Dallas, TX</option>
            </select>
          </div>

          <div className="form-group">
            <label>Members:</label>
            <input
              type="text"
              name="member"
              value={this.state.searchMember}
              placeholder="Add Member"
              onChange={(evt) => this.filterMembers(evt)} />
            <button>
              <i className="fa fa-plus" aria-hidden="true"></i>
            </button>
            <br />
            <div className={this.state.searchMember.length > 0 ? "search-results-display" : "hidden"}>
              {searchResultsDisplay}
            </div>
          </div>

          <button onClick={(evt) => this.submitForm(evt)}>Create Band</button>

        </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(BandCreateForm);
