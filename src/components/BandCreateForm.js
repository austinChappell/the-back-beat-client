import React, { Component } from 'react';
import { connect } from 'react-redux';

class BandCreateForm extends Component {

  state = {
    bands: [],
    bandName: '',
    bandGenre: '',
    bandLevel: '',
    bandCity: '',
    bandDescription: '',
    searchMember: '',
    searchMemberResuts: [],
    members: [],
    descriptionCount: 500,
    isEditing: false,
    genreOptionsArr: [
      { value: '', text: '---' },
      { value: 'Rock', text: 'Rock' },
      { value: 'Jazz', text: 'Jazz'},
      { value: 'Country', text: 'Country'}
    ],
    skillOptionsArr: [
      { value: '', text: '---' },
      { value: 'Professional', text: 'Professional' },
      { value: 'Semi-Professional', text: 'Semi-Professional' },
      { value: 'Amateur', text: 'Amateur' },
      { value: 'Novice', text: 'Novice' }
    ],
    cityOptionsArr: [
      { value: '', text: '---' },
      { value: 'Austin, TX', text: 'Austin, TX' },
      { value: 'Dallas, TX', text: 'Dallas, TX' }
    ]
  }

  componentDidMount() {
    if (this.props.match.params.bandId) {
      this.loadBandData(this.props.match.params.bandId);
    }
    let members = this.state.members.slice();
    let user = Object.assign({}, this.props.currentUser, { admin: true })
    members.push(user);
    this.setState({ members });
  }

  loadBandData = (bandId) => {
    const url = this.props.apiURL;
    fetch(`${url}/api/band/${bandId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('BAND DATA', results.rows);
      const bandData = results.rows[0];
      const members = [];
      results.rows.forEach((member) => {
        const newMember = {
          id: member.id,
          first_name: member.first_name,
          last_name: member.last_name
        }
        if (member.id === bandData.band_admin_id) {
          newMember.admin = true;
        }
        members.push(newMember)
      });
      const bandInfo = {
        bandName: bandData.band_name,
        bandGenre: bandData.band_genre,
        bandLevel: bandData.band_skill_level,
        bandCity: bandData.band_city,
        bandDescription: bandData.band_description,
        members,
        isEditing: true
      };
      this.setState(bandInfo);
    })
  }

  handleInputChange = (evt, input) => {

    if (input === 'bandDescription') {
      console.log('This is from the band description');
      console.log(evt.target.value.length);
      this.setState({ descriptionCount: 500 - evt.target.value.length });
    }

    const updateStateObject = {};
    updateStateObject[input] = evt.target.value;
    this.setState(updateStateObject);
  }

  submitForm = (evt) => {
    evt.preventDefault();
    const url = this.props.apiURL;
    const submitType = this.state.isEditing ? `edit/${this.props.match.params.bandId}` : 'create';
    const fetchMethod = this.state.isEditing ? 'PUT' : 'POST';
    console.log('SUBMIT TYPE', submitType);
    const formBody = {
      bandName: this.state.bandName,
      bandGenre: this.state.bandGenre,
      bandLevel: this.state.bandLevel,
      bandCity: this.state.bandCity,
      bandDescription: this.state.bandDescription
    };
    fetch(`${url}/band/${submitType}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: fetchMethod,
      body: JSON.stringify(formBody)
    }).then((response) => {
      console.log('Function running');
      return response.json();
    }).then((results) => {
      console.log('RESULTS ARE', results);
      this.addMembersToBand(results.rows[0].band_id, this.state.members);
      let bands = this.state.bands.slice();
      bands.push(results.rows[0]);
      this.setState({ bands, bandName: '', bandGenre: '', bandLevel: '', bandCity: '' });
    }).catch((err) => {
      throw err;
    })
  }

  addMember = (evt, user) => {
    console.log('User Id', user);
    let members = this.state.members.slice();
    const member = Object.assign({}, user, { admin: false });
    members.push(member);
    this.setState({ members, searchMember: '' });
  }

  addMembersToBand = (bandId, members) => {
    console.log('BAND ID IS', bandId);
    const url = this.props.apiURL;
    this.state.members.forEach((member) => {
      let memberId = member.id;
      fetch(`${url}/editband/${bandId}/addmember/${memberId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ bandId, memberId })
      }).then((response) => {
        return response.json();
      }).then((results) => {
        console.log('ADD MEMBER RESULTS', results);
        this.setState({ members: [] });
        this.props.history.push(`/band/${bandId}`);
      })
    })
  }

  render() {

    let searchResultsDisplay = this.state.searchMemberResuts.map((user) => {
      return (
        <div className="single-search-result" onClick={(evt) => this.addMember(evt, user)}>
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

    let submitButtonText = this.state.isEditing ? 'Update Band' : 'Create Band';

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
              {this.state.genreOptionsArr.map((genre) => {
                if (genre.value === this.state.bandGenre) {
                  return <option value={genre.value} selected>{genre.text}</option>;
                } else {
                  return <option value={genre.value}>{genre.text}</option>
                }
              })}
            </select>
          </div>

          <div className="form-group">
            <label>Skill Level:</label>
            <select name="level" value={this.state.bandLevel} onChange={(evt) => this.handleInputChange(evt, 'bandLevel')}>
              {this.state.skillOptionsArr.map((skill) => {
                if (skill.value === this.state.bandLevel) {
                  return <option value={skill.value} selected>{skill.text}</option>;
                } else {
                  return <option value={skill.value}>{skill.text}</option>;
                }
              })}
            </select>
          </div>

          <div className="form-group">
            <label>City:</label>
            <select name="city" value={this.state.bandCity} onChange={(evt) => this.handleInputChange(evt, 'bandCity')}>
              {this.state.cityOptionsArr.map((city) => {
                if (city.value === this.state.bandCity) {
                  return <option value={city.value} selected>{city.text}</option>;
                } else {
                  return <option value={city.text}>{city.text}</option>
                }
              })}
            </select>
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea name="description" value={this.state.bandDescription} onChange={(evt) => this.handleInputChange(evt, 'bandDescription')}>
            </textarea>
            <p className={this.state.descriptionCount > 20 ? "charCount" : "charCount lowCount"}>Characters Remaining: {this.state.descriptionCount}</p>
          </div>

          <button onClick={(evt) => this.submitForm(evt)}>{ submitButtonText }</button>

        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    currentUser: state.currentUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BandCreateForm);
