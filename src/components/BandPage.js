import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import Avatar from 'material-ui/Avatar';
import BandMemberMgmt from './BandMemberMgmt';
import Dialog from 'material-ui/Dialog';
import EventCreator from './EventCreator';
import EventList from './EventList';
import FlatButton from 'material-ui/FlatButton';
import InstrumentModal from './InstrumentModal';
import {List, ListItem} from 'material-ui/List';
import Modal from './Modal';
import SideBar from './SideBar';
import TextField from 'material-ui/TextField';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { RaisedButton } from 'material-ui';

class BandPage extends Component {

  constructor(props) {
    super(props);

    const bandId = props.match.params.bandId;

    this.state = {
      bandAdminId: null,
      bandCharts: [],
      bandEvents: [],
      bandId: props.match.params.bandId,
      bandInfoArr: [],
      chartTitle: '',
      displayInstrumentModal: false,
      displayModal: false,
      editingUserId: null,
      eventTypes: [
        { value: 'Gig', text: 'Gig' },
        { value: 'Rehearsal', text: 'Rehearsal' }
      ],
      searchMember: '',
      searchMemberResuts: [],
      showCharModal: false,
      sideBarLinks: [
        { title: 'Band Info', path: `/band/${bandId}` },
        { title: 'Dashboard', path: `/band/${bandId}/dashboard` },
        { title: 'Calendar', path: `/band/${bandId}/calendar` },
        { title: 'Uploads', path: `/band/${bandId}/uploads` },
        { title: 'Chat', path: `/band/${bandId}/chat` }
      ],
      members: [],
      membersAsItems: [],
      showDeleteForm: false,
    }

  }


  componentDidMount() {
    this.getMembers();
    this.getCharts();
    this.getEvents();
    this.getInstruments();
  }

  addInstrument = (instrumentId) => {
    const apiURL = this.props.apiURL;
    const bandId = this.props.match.params.bandId;
    fetch(`${apiURL}/editband/${bandId}/addinstrument/${instrumentId}?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
    }).then((results) => {
      this.getInstruments();
    }).catch((err) => {
      console.log('error', err);
    })
  }

  assignInstrument(evt, index, val) {
    this.updateUserInstrument(val);
  }

  displayInstrumentModal = (bool) => {
    const self = this;
    this.setState({ displayInstrumentModal: bool }, () => {
      setTimeout(() => {
        self.getInstruments();
      }, 200);
    });
  }

  updateUserInstrument = (instrumentId) => {
    const apiURL = this.props.apiURL;
    const bandId = this.props.match.params.bandId;
    const memberId = this.state.editingUserId;
    fetch(`${apiURL}/api/band/member/instrument/edit?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify({
        bandId,
        instrumentId,
        memberId
      })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.getMembers();
    }).catch((err) => {
      console.log('ERROR', err);
    })
  }

  getInstruments = () => {
    console.log('GETTING INSTRUMENTS');
    const apiURL = this.props.apiURL;
    const bandId = this.props.match.params.bandId;
    fetch(`${apiURL}/api/band/${bandId}/instruments?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      const selectedInstrumentIds = [];
      results.rows.forEach((instrument) => {
        selectedInstrumentIds.push(instrument.instrument_id);
      })
      // this.setState({ bandInstruments: results.rows });
      this.props.setBandInstruments(results.rows);
      this.props.setSelectedInstrumentIds(selectedInstrumentIds);
      // console.log('ABOUT TO CALL UPDATE INSTRUMENTS');
      this.updateMemberInstruments(results.rows);
    }).catch((err) => {
      console.log('ERROR', err);
    })
  }

  getMembers = () => {
    const apiURL = this.props.apiURL;
    const bandId = this.props.match.params.bandId;
    fetch(`${apiURL}/api/band/${bandId}?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      let members = [];
      let membersAsItems = [];
      results.rows.forEach((member) => {
        members.push({
          city: member.city,
          id: member.id,
          instrument_id: member.instrument_id,
          first_name: member.first_name,
          last_name: member.last_name,
          profile_image_url: member.profile_image_url
        });
      })
      this.membersToItems(members);
      this.setState({ bandInfoArr: results.rows, members });
      this.setState({ bandAdminId: results.rows[0].band_admin_id });
    })
  }

  membersToItems = (members) => {
    const output = [];
    members.forEach((member) => {
      const item = {
        avatar: member.profile_image_url,
        id: member.id,
        instrument_id: member.instrument_id,
        subtitle: 'Instrument Goes Here Yo!',
        title: `${member.first_name} ${member.last_name}`
      }
      output.push(item);
    })
    this.setState({ membersAsItems: output });
  }

  addChart = (evt) => {
    evt.preventDefault();
    const apiURL = this.props.apiURL;
    const bandId = this.props.match.params.bandId;
    fetch(`${apiURL}/band/upload/pdf/${bandId}?token=${localStorage.token}`, {
      credentials: 'include',
      encoding: null,
      headers: {
        'Content-Type': 'application/json',

      },
      method: 'POST',
      body: JSON.stringify({
        title: this.state.chartTitle,
        pdf: this.state.currentPdf
      })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.displayChartModal(false);
    }).catch((err) => {
      console.log('error', err);
    })
  }

  displayChartModal = (show) => {
    this.setState({ showCharModal: show });
  }

  displayPreview = (url) => {
    window.open(url, '_blank');
  }

  filterMembers = (evt) => {
    const value = evt.target.value;
    const url = this.props.apiURL;
    this.setState({searchMember: value}, () => {
      if (this.state.searchMember !== '') {
        fetch(`${url}/api/searchusernames/${value}?token=${localStorage.token}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',

          },
        }).then((response) => {
          return response.json();
        }).then((results) => {
          this.setState({searchMemberResuts: results.rows});
        })
      }
    })
  }

  getCharts = () => {
    const apiURL = this.props.apiURL;
    const bandId = this.props.match.params.bandId;
    const url = `${apiURL}/api/band/charts/pdf/${bandId}?token=${localStorage.token}`;
    fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ bandCharts: results.rows });
    }).catch((err) => {
      console.log('error', err);
    })
  }

  getEvents = () => {
    const url = this.props.apiURL;
    const bandId = this.props.match.params.bandId;
    fetch(`${url}/api/gig/band/${bandId}?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ bandEvents: results.rows });
    })
  }

  handleInputChange = (val) => {
    this.setState({ chartTitle: val });
  }

  handleFileChange = (evt) => {
    const self = this;
    // this.setState({ currentPdf: evt.target.files[0].name });
    let reader = new FileReader();
    reader.onload = function (event) {
      self.setState({ currentPdf: event.currentTarget.result });
    };
    reader.readAsBinaryString(evt.target.files[0]);
  }

  addMember = (evt, user) => {
    fetch(`${this.props.apiURL}/editband/${this.props.match.params.bandId}/addmember/${user.id}?token=${localStorage.token}`, {
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
      member.instrument_id = -1;
      members.push(member);
      this.membersToItems(members);
      this.setState({ members, searchMember: '' });
    })
  }

  setEditingUser = (id) => {
    this.setState({ editingUserId: id });
  }

  removeMember = (userId, index) => {
    fetch(`${this.props.apiURL}/editband/${this.props.match.params.bandId}/removemember/${userId}?token=${localStorage.token}`, {
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
      this.getMembers();
    })
  }

  updateMemberInstruments = (instruments) => {
    const members = this.state.membersAsItems;

    // console.log(members);
    // console.log(instruments);

    members.forEach((member) => {
      let found = false;
      instruments.forEach((instrument) => {
        if (member.instrument_id === instrument.instrument_id) {
          found = true;
        }
      })
      if (!found) {
        // DELETE INSTRUMENT
        console.log('DELETE INSTRUMENT FOR', member);
        const apiURL = this.props.apiURL;
        const bandId = this.props.match.params.bandId;
        fetch(`${apiURL}/api/band/member/instrument/edit?token=${localStorage.token}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'PUT',
          body: JSON.stringify({
            bandId,
            instrumentId: -1,
            memberId: member.id
          })
        }).then((response) => {
          return response.json();
        }).then((results) => {
          this.getMembers();
          console.log('success');
        }).catch((err) => {
          console.log('error', err);
        })
      }
    })
  }

  toggleDeleteForm = () => {
    this.setState({showDeleteForm: !this.state.showDeleteForm});
  }

  deleteBand = () => {
    const url = this.props.apiURL;
    const bandId = this.props.match.params.bandId;
    fetch(`${url}/band/delete/${bandId}?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      },
      method: 'DELETE',
      body: JSON.stringify({ bandId })
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.props.history.push('/');
    })
  }

  toggleModal = () => {
    this.setState({ displayModal: !this.state.displayModal });
    this.getEvents();
  }

  closeModal = () => {
    this.setState({ displayModal: false })
  }

  showModal = () => {
    this.setState({ displayModal: true });
  }

  render() {

    const randomCache = Math.floor(Math.random() * 1000000);
    let searchResultsDisplay = this.state.searchMemberResuts.map((user) => {
      const imageSrc = user.profile_image_url;

      return (
        <ListItem
          rightAvatar={<Avatar src={imageSrc} />}
          onClick={(evt) => this.addMember(evt, user)}
          >
            <h4>{user.first_name} {user.last_name} - <span>{user.city}</span></h4>
          </ListItem>
        )
      });

      const actions = [
        <FlatButton
          label="Cancel"
          primary={true}
          onClick={() => this.displayChartModal(false)}
        />,
        <FlatButton
          disabled={this.state.messages === ''}
          label="Submit"
          primary={true}
          onClick={(evt) => this.addChart(evt)}
        />,
      ];

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
    let addCharts;
    let editInstruments;

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
          <List className={this.state.searchMember.length > 0 ? "search-results-display" : "hidden"}>
            {searchResultsDisplay}
          </List>
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
        // <i className="fa fa-plus add-button" aria-hidden="true" onClick={this.toggleModal}></i>
        <FloatingActionButton
          mini={true}
          secondary={true}
          onClick={this.showModal}
          >
            <ContentAdd />
          </FloatingActionButton>
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
            closeModal={this.closeModal}
            displayModal={this.state.displayModal}
            eventTypes={this.state.eventTypes}
            submitQuery={`api/gig/band/${this.props.match.params.bandId}`}
          />
          :
          null;

          addCharts = this.props.loggedInUser.id === bandData.band_admin_id ?
          <div>
            <FloatingActionButton
              mini={true}
              secondary={true}
              onClick={() => this.displayChartModal(true)}
              >
                <ContentAdd />
              </FloatingActionButton>
            </div>
            : null;

            editInstruments = this.props.loggedInUser.id === bandData.band_admin_id ?
            <div>
              <h1>Instrumentation</h1>
                {this.props.bandInstruments.map((instrument, index) => {
                  return (
                    <div
                      className="instrument-list"
                      key={index}
                    >
                      <p>{instrument.name}</p>
                    </div>
                  )
                })}

              <RaisedButton
                label="Edit Instrumentation"
                onClick={() => this.displayInstrumentModal(true)}
                secondary={true}
              />
              </div>
              :
              null;

            }


            let bandInfo = bandData === undefined ? null :
            <div className="band-info-section">
              <div className="band-details">
                <h1>{bandData.band_name}<sup>{ editButton }{ deleteButton }{ searchMembersLink }</sup></h1>
                <h2>{bandData.band_city}</h2>
                <h2>{bandData.band_genre}</h2>
                <h3>{bandData.band_skill_level}</h3>
                <p>{bandData.band_description}</p>



                <div className="members">
                  { addMembers }
                </div>
                { confirmDeleteForm }
                <div className="charts">
                  <h1>Charts</h1>
                  {addCharts}
                  {editInstruments}
                  <List className="band-charts">
                    {this.state.bandCharts.map((chart, index) => {
                      return (
                        <ListItem
                          className="band-chart"
                          key={index}
                          onClick={() => this.displayPreview(chart.url)}
                          primaryText={chart.chart_title}
                        />
                      )
                    })}
                  </List>
                  <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.showCharModal}
                    onRequestClose={() => this.displayChartModal(false)}
                    >
                      <TextField
                        floatingLabelText="Chart Title"
                        floatingLabelStyle={{ textAlign: 'left' }}
                        onChange={(evt) => this.handleInputChange(evt.target.value)}
                        value={this.state.chartTitle}
                      />
                      <input type="file" accept=".pdf" onChange={(evt) => this.handleFileChange(evt)} />
                    </Dialog>
                  </div>
                </div>

              </div>

              return (
                <div className="BandPage">
                  <SideBar
                    links={this.state.sideBarLinks}
                  />
                  <div className="band-info">
                    <Link className="sidebar-link" to={`/band/${this.state.bandId}/chat`}>
                      Chat
                    </Link>
                    <Link className="sidebar-link" to={`/band/${this.state.bandId}/uploads`}>
                      Uploads
                    </Link>
                    {bandInfo}
                    {createEventForm}
                    <BandMemberMgmt
                      adminId={this.state.bandAdminId}
                      assignInstrument={this.assignInstrument.bind(this)}
                      members={this.state.membersAsItems}
                      removeMember={this.removeMember}
                      setEditingUser={this.setEditingUser}
                    />
                    <div className="band-events">
                      <h2>Gigs and Rehearsals {addButton}</h2>
                      <EventList
                        data={this.state.bandEvents}
                        url="band_event"
                      />
                    </div>
                  </div>
                  <InstrumentModal
                    addInstrument={this.addInstrument}
                    bandId={this.props.match.params.bandId}
                    bandInstruments={this.props.bandInstruments}
                    displayInstrumentModal={this.displayInstrumentModal}
                    show={this.state.displayInstrumentModal}
                  />
                </div>
              )
            }
          }

          const mapStateToProps = (state) => {
            return {
              apiURL: state.apiURL,
              bandInstruments: state.bandInstruments,
              loggedInUser: state.loggedInUser
            }
          }

          const mapDispatchToProps = (dispatch) => {
            return {
              setBandInstruments: (instruments) => {
                const action = { type: 'SET_BAND_INSTRUMENTS', instruments };
                dispatch(action);
              },

              setSelectedInstrumentIds: (selectedInstrumentIds) => {
                const action = { type: 'SET_SELECTED_INSTRUMENT_IDS', selectedInstrumentIds };
                dispatch(action);
              }
            }
          }

          export default connect(mapStateToProps, mapDispatchToProps)(BandPage);
