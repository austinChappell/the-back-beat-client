import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import EventCreator from './EventCreator';
import EventList from './EventList';
import Modal from './Modal';

class BandPage extends Component {

  state = {
    bandEvents: [],
    bandInfoArr: [],
    displayModal: false,
    eventTypes: [
      { value: 'Gig', text: 'Gig' },
      { value: 'Rehearsal', text: 'Rehearsal' }
    ],
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
      let members = [];
      results.rows.forEach((member) => {
        members.push({ first_name: member.first_name, last_name: member.last_name, id: member.id, city: member.city });
      })
      this.setState({ bandInfoArr: results.rows, members });
    })

    this.getEvents();
  }

  filterMembers = (evt) => {
    const value = evt.target.value;
    const url = this.props.apiURL;
    this.setState({searchMember: value}, () => {
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

  getEvents = () => {
    const url = this.props.apiURL;
    const bandId = this.props.match.params.bandId;
    fetch(`${url}/api/gig/band/${bandId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ bandEvents: results.rows });
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
      return response.json();
    }).then((results) => {
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
      let members = this.state.members.slice();
      members.splice(index, 1);
      this.setState({ members });
    })
  }

  toggleDeleteForm = () => {
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

  toggleModal = () => {
    this.setState({ displayModal: !this.state.displayModal });
    this.getEvents();
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
    let addButton;
    let deleteButton;
    let confirmDeleteForm;
    let searchMembersLink;
    let createEventForm;

    if (this.state.bandInfoArr.length > 0) {
      bandData = this.state.bandInfoArr[0];

      addMembers = this.props.loggedInUser.id === bandData.band_admin_id ?
      <div className="add-members-div">
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

      editButton = this.props.loggedInUser.id === bandData.band_admin_id ?
      <Link className="edit-band" to={`/band/${bandData.band_id}/edit`}>
        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
      </Link>
      :
      null;

      deleteButton = this.props.loggedInUser.id === bandData.band_admin_id
      ?
      <span className="delete-band">
        <i
          className={this.state.showDeleteForm ? "hide" : "fa fa-trash-o"}
          onClick={this.toggleDeleteForm}></i>
      </span>
      :
      null;

      addButton = this.props.loggedInUser.id === bandData.band_admin_id ?
      <i className="fa fa-plus add-button" aria-hidden="true" onClick={this.toggleModal}></i>
      :
      null;

      confirmDeleteForm = this.props.loggedInUser.id === bandData.band_admin_id
      ?
      <div className={this.state.showDeleteForm ? "delete-band-form" : "hide"}>
        <div className="form">
          <h3>Are you sure you want to permanently delete "{bandData.band_name}"?</h3>
          <button className="confirm" onClick={this.deleteBand}>Yes, delete</button>
          <button className="goback" onClick={this.toggleDeleteForm}>Nevermind</button>
        </div>
      </div>
      :
      null;

      searchMembersLink = this.props.loggedInUser.id === bandData.band_admin_id
      ?
      <span className="search-members-link">
        <Link to={`/band/${bandData.band_id}/search_musicians/admin/${bandData.band_admin_id}`}>Browse Local Musicians</Link>
      </span>
      :
      null;

      createEventForm = this.props.loggedInUser.id === bandData.band_admin_id ?
      <EventCreator
        closeModal={this.toggleModal}
        displayModal={this.state.displayModal}
        exitClick={this.toggleModal}
        eventTypes={this.state.eventTypes}
        submitQuery={`api/gig/band/${this.props.match.params.bandId}`}
      />
      :
      null;
    }

    let bandInfo = bandData === undefined ? null :
    <div className="band-info-section">
      <div className="band-details">
        <h1>{bandData.band_name}<sup>{ editButton }{ deleteButton }{ searchMembersLink }</sup></h1>
        <h2>City: {bandData.band_city}</h2>
        <h2>Genre: {bandData.band_genre}</h2>
        <h3>Type: {bandData.band_skill_level}</h3>
        <p>{bandData.band_description}</p>



        <div className="members">
          <h3>Members:</h3>
          {this.state.members.map((member, index) => {
            let removeButton;

            removeButton = this.props.loggedInUser.id === bandData.band_admin_id
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
        { confirmDeleteForm }
      </div>

    </div>

    return (
      <div className="BandPage">
        <div className="band-info">
          {bandInfo}
          {createEventForm}
          <div className="band-events">
            <h2>Gigs and Rehearsals {addButton}</h2>
            <EventList
              data={this.state.bandEvents}
              url="band_event"
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apiURL: state.apiURL,
    loggedInUser: state.loggedInUser
  }
}

export default connect(mapStateToProps)(BandPage);
