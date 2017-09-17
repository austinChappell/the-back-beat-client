import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

class BandPage extends Component {

  state = {
    bandInfoArr: [],
    searchMember: '',
    searchMemberResuts: [],
    members: [],
    showDeleteForm: false
  }

  componentDidMount() {
    const url = this.props.apiURL;
    const bandId = this.props.match.params.bandId;
    fetch(`${url}/api/band/${bandId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('DID MOUNT', results);
      let members = [];
      results.rows.forEach((member) => {
        members.push({ first_name: member.first_name, last_name: member.last_name, id: member.id, city: member.city });
      })
      this.setState({ bandInfoArr: results.rows, members });
    })
  }

  filterMembers = (evt) => {
    const value = evt.target.value;
    const url = this.props.apiURL;
    this.setState({searchMember: value}, () => {
      console.log('input changing');
      if (this.state.searchMember !== '') {
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
      }
    })
  }

  addMember = (evt, user) => {
    fetch(`${this.props.apiURL}/editband/${this.props.match.params.bandId}/addmember/${user.id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ bandId: this.props.match.params.bandId, memberId: user.id })
    }).then((response) => {
      console.log('RESPONSE', response);
      return response.json();
    }).then((results) => {
      console.log('ADD MEMBER', results);
      console.log('User Id', user);
      let members = this.state.members.slice();
      const member = Object.assign({}, user, { admin: false });
      members.push(member);
      this.setState({ members, searchMember: '' });
    })
  }

  removeMember = (userId, index) => {
    fetch(`${this.props.apiURL}/editband/${this.props.match.params.bandId}/removemember/${userId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ bandId: this.props.match.params.bandId, memberId: userId })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('DELETE RESULTS', results);
      let members = this.state.members.slice();
      members.splice(index, 1);
      this.setState({ members });
    })
  }

  toggleDeleteForm = () => {
    console.log('DELETE BUTTON CLICKED');
    this.setState({showDeleteForm: !this.state.showDeleteForm});
  }

  deleteBand = () => {
    const url = this.props.apiURL;
    const bandId = this.props.match.params.bandId;
    fetch(`${url}/band/delete/${bandId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'DELETE',
      body: JSON.stringify({ bandId })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      console.log('THE FUNCTION MADE IT THIS FAR');
      this.props.history.push('/');
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

    let bandData;
    let addMembers;
    let editButton;
    let deleteButton;
    let confirmDeleteForm;

    if (this.state.bandInfoArr.length > 0) {
      bandData = this.state.bandInfoArr[0];

      addMembers = this.props.currentUser.id === bandData.band_admin_id ?
      <div>
        <input
          type="text"
          name="member"
          value={this.state.searchMember}
          placeholder="Add Member"
          onChange={(evt) => this.filterMembers(evt)} />
        <br />
        <div className={this.state.searchMember.length > 0 ? "search-results-display" : "hidden"}>
          {searchResultsDisplay}
        </div>
      </div>
      :
      null;

      editButton = this.props.currentUser.id === bandData.band_admin_id ?
      <Link to={`/band/${bandData.band_id}/edit`}>Edit Band</Link>
      :
      null;

      deleteButton = this.props.currentUser.id === bandData.band_admin_id
      ?
      <button
        className={this.state.showDeleteForm ? "hide" : ""}
        onClick={this.toggleDeleteForm}>Delete Band</button>
      :
      null;

      confirmDeleteForm = this.props.currentUser.id === bandData.band_admin_id
      ?
      <div className={this.state.showDeleteForm ? "" : "hide"}>
        <h3>Are you sure you want to permanently delete "{bandData.band_name}"?</h3>
        <button onClick={this.deleteBand}>Yes, delete</button>
        <button onClick={this.toggleDeleteForm}>Nevermind</button>
      </div>
      :
      null;
    }

    let bandInfo = bandData === undefined ? null :
    <div>
      <h1>{bandData.band_name} - <span>{bandData.band_city}</span></h1>
      <h2>Genre: {bandData.band_genre}</h2>
      <h3>Type: {bandData.band_skill_level}</h3>
      <p>{bandData.band_description}</p>
      <div className="members">
        <h3>Members:</h3>
        {this.state.members.map((member, index) => {
          let removeButton;

          removeButton = this.props.currentUser.id === bandData.band_admin_id
          ?
          <i className="fa fa-times-circle" aria-hidden="true" onClick={() => this.removeMember(member.id, index)}></i>
          :
          null;

          let adminLabel = bandData.band_admin_id === member.id
          ?
          <span>(admin)</span>
          :
          <span>{ removeButton }</span>;

          return (
            <h4 key={index}>{member.first_name} {member.last_name} - {member.city} {adminLabel}</h4>
          )
        })}
        { addMembers }
      </div>
      { editButton }
      { deleteButton }
      { confirmDeleteForm }

    </div>

    return (
      <div className="BandPage">
        {bandInfo}
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

export default connect(mapStateToProps)(BandPage);
