import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import Avatar from 'material-ui/Avatar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import EventCreator from './EventCreator';
import EventList from './EventList';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import Modal from './Modal';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { RaisedButton } from 'material-ui';

class BandPage extends Component {

    state = {
        bandCharts: [],
        bandEvents: [],
        bandInfoArr: [],
        bandInstruments: [
            {id: 3, name: 'Trumpet'},
            {id: 7, name: 'Acoustic Guitar'}
        ],
        chartTitle: 'Hello',
        displayModal: false,
        eventTypes: [
            { value: 'Gig', text: 'Gig' },
            { value: 'Rehearsal', text: 'Rehearsal' }
        ],
        searchInstrument: '',
        searchInstrumentResults: [],
        searchMember: '',
        searchMemberResuts: [],
        showModal: false,
        members: [],
        instruments: [],
        showDeleteForm: false,
        submitModal: () => {}
    }

    componentDidMount() {
        const url = this.props.apiURL;
        const bandId = this.props.match.params.bandId;
        fetch(`${url}/api/band/${bandId}?token=${localStorage.token}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',

            }
        }).then((response) => {
            return response.json();
        }).then((results) => {
            let members = [];
            const allInstruments = this.props.allInstruments;
            results.rows.forEach((member) => {
                members.push({ first_name: member.first_name, last_name: member.last_name, id: member.id, city: member.city, profile_image_url: member.profile_image_url, instrument_id: member.instrument_id });
            })
            members.forEach((member) => {
                if (member.instrument_id === null) {
                    member.instrument = 'unassigned';
                } else {
                    allInstruments.forEach((instrument) => {
                        if (member.instrument_id === instrument.instrument_id) {
                            member.instrument = instrument.name;
                        }
                    })
                }
            })
            this.setState({ bandInfoArr: results.rows, members });
        })

        this.getCharts();
        this.getEvents();
        this.getInstruments();
    }

    addChart = () => {
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
            console.log('results', results.rows);
            this.displayChartModal(false);
        }).catch((err) => {
            console.log('error', err);
        })
    }

    displayChartModal = (show) => {
        this.setState({ showModal: show });
    }

    displayPreview = (url) => {
        window.open(url, '_blank');
    }

    typeAhead = (evt, key, path, updateKey) => {
        const value = evt.target.value;
        const url = this.props.apiURL;
        const obj = {};
        obj[key] = value;
        this.setState(obj, () => {
            if (this.state[key] !== '') {
                fetch(`${url}/api/${path}/${value}?token=${localStorage.token}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                }).then((response) => {
                    return response.json();
                }).then((results) => {
                    console.log(results.rows);
                    const updateObj = {};
                    updateObj[updateKey] = results.rows;
                    this.setState(updateObj);
                })
            }
        })
    }

    getCharts = () => {
        const apiURL = this.props.apiURL;
        const bandId = this.props.match.params.bandId;
        const url = `${apiURL}/api/band/charts/pdf/${bandId}?token=${localStorage.token}`;
        console.log('ABOUT TO FETCH', url);
        fetch(url, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            return response.json();
        }).then((results) => {
            console.log('CHARTS', results.rows);
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

    getInstruments = () => {
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
            console.log('INSTRUMENTS', results.rows);
            this.setState({ bandInstruments: results.rows, searchInstrument: '' });
        }).catch((err) => {
            console.log('ERROR', err);
        })
    }

    // TODO: This is not working properly
    handleInputChange = (val) => {
        console.log('changing', val);
        this.setState({ chartTitle: val });
    }

    handleFileChange = (evt) => {
        console.log(evt.target.files[0]);
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
            members.push(member);
            this.setState({ members, searchMember: '' });
        })
    }

    // TODO: CHANGE instrument_id in DB to id. Then addInstrument and addMember can be the same function. Or pass in the id of the member/instrument, in addition to the entire object.
    addInstrument = (evt, instrument) => {
        fetch(`${this.props.apiURL}/editband/${this.props.match.params.bandId}/addinstrument/${instrument.instrument_id}?token=${localStorage.token}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',

            },
            method: 'POST',
            body: JSON.stringify({ bandId: this.props.match.params.bandId, instrumentId: instrument.instrument_id })
        }).then((response) => {
            return response.json();
        }).then((results) => {
            this.getInstruments();
        })
    }

    // TODO: This is a mess. We need to look at the submit function. HINT: this.state.submitModal
    editMember = (member) => {
        const bandId = this.props.match.params.bandId;
        const memberId = member.id;
        const instrumentId = this.state.pendingInstrumentId;
        const submitFunc = this.saveUserInstrument;
        const editMemberDialogChildren = <div>
            <h2>{member.first_name} {member.last_name}</h2>
            <SelectField
              floatingLabelText="Instrument"
              value={member.instrument_id}
              onChange={this.updateUserInstrument}
            >
              {this.state.bandInstruments.map((instrument) => {
                return (
                  <MenuItem
                    value={instrument.instrument_id}
                    primaryText={instrument.name}
                  />
                )
              })}
            </SelectField>
        </div>

        this.setState({ dialogChildren: editMemberDialogChildren, showModal: true, submitModal: () => submitFunc(bandId, memberId, instrumentId) });
    }

    removeInstrument = (instrumentId, index) => {
        fetch(`${this.props.apiURL}/editband/${this.props.match.params.bandId}/removeinstrument/${instrumentId}?token=${localStorage.token}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',

            },
            method: 'DELETE',
            body: JSON.stringify({ bandId: this.props.match.params.bandId, instrumentId })
        }).then((response) => {
            return response.json();
        }).then((results) => {
            this.getInstruments();
        })
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
            console.log('THE FUNCTION MADE IT THIS FAR');
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

    saveUserInstrument = (bandId, memberId, instrumentId) => {
        const apiURL = this.props.apiURL;
        fetch(`${apiURL}/api/band/member/instrument/edit/?token=${localStorage.token}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({
                bandId,
                memberId,
                instrumentId
            })
        })
    }

    updateUserInstrument = (evt, index, value) => {
        console.log('EVENT', evt);
        console.log('INDEX', index);
        console.log('VALUE', value);
        this.setState({ pendingInstrumentId: value });
    }

    render() {

        console.log('STATE', this.state);

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

            if (this.state.searchMember.length === 0) {
                searchResultsDisplay = null
            } else if (this.state.searchMember.length > 0 && this.state.searchMemberResuts.length === 0) {
                searchResultsDisplay = <div className="no-results">
                <span>(No results)</span>
            </div>
        }

        let searchInstrumentDisplay = this.state.searchInstrumentResults.map((instrument) => {

            return (
                <ListItem
                    onClick={(evt) => this.addInstrument(evt, instrument)}
                    >
                        <h4>{instrument.name}</h4>
                    </ListItem>
                )
            });

            let actions = [
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
                <FlatButton
                    disabled={this.state.messages === ''}
                    label="Submit"
                    primary={true}
                    onClick={(evt) => this.state.submitModal(evt)}
                />,
            ];

            if (this.state.searchInstrument.length === 0) {
                searchInstrumentDisplay = null
            } else if (this.state.searchInstrument.length > 0 && this.state.searchInstrumentResults.length === 0) {
                searchInstrumentDisplay = <div className="no-results">
                <span>(No results)</span>
            </div>
        }

        let bandData;
        let addInstruments;
        let addMembers;
        let editButton;
        let addButton;
        let deleteButton;
        let confirmDeleteForm;
        let searchMembersLink;
        let createEventForm;
        let addCharts;

        const chartModalChildren = <div>
            <TextField
                floatingLabelText="Chart Title"
                floatingLabelStyle={{ textAlign: 'left' }}
                onChange={(evt) => this.handleInputChange(evt.target.value)}
                value={this.state.chartTitle}
            />
            <input type="file" accept=".pdf" onChange={(evt) => this.handleFileChange(evt)} />
        </div>

        if (this.state.bandInfoArr.length > 0) {
            bandData = this.state.bandInfoArr[0];

            addInstruments = this.props.loggedInUser.id === bandData.band_admin_id ?
            <div className="add-instruments-div">
                <input
                    type="text"
                    name="instrument"
                    value={this.state.searchInstrument}
                    placeholder="Add Instrument"
                    onChange={(evt) => this.typeAhead(evt, 'searchInstrument', 'searchinstruments', 'searchInstrumentResults')}
                />
                <br />
                <List className={this.state.searchInstrument.length > 0 ? "search-results-display" : "hidden"}>
                    {searchInstrumentDisplay}
                </List>
            </div>
            :
            null;

            addMembers = this.props.loggedInUser.id === bandData.band_admin_id ?
            <div className="add-members-div">
                <input
                    type="text"
                    name="member"
                    value={this.state.searchMember}
                    placeholder="Add Member"
                    onChange={(evt) => this.typeAhead(evt, 'searchMember', 'searchusernames', 'searchMemberResuts')}
                />
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
                    onClick={() => {
                        this.setState({ dialogChildren: chartModalChildren, submitModal: this.addChart })
                        this.displayChartModal(true);
                    }}
                >
                    <ContentAdd />
                </FloatingActionButton>
            </div>
            : null;
        }


        let bandInfo = bandData === undefined ? null :
        <div className="band-info-section">
            <div className="band-details">
                <h1>{bandData.band_name}<sup>{ editButton }{ deleteButton }{ searchMembersLink }</sup></h1>
                <h2>{bandData.band_city}</h2>
                <h2>{bandData.band_genre}</h2>
                <h3>{bandData.band_skill_level}</h3>
                <p>{bandData.band_description}</p>

                <div className="instruments">
                    <h2>Instrumentation</h2>
                    {this.state.bandInstruments.map((instrument, index) => {
                        let removeButton;

                        removeButton = this.props.loggedInUser.id === bandData.band_admin_id
                        ?
                        <i className="fa fa-times-circle" aria-hidden="true" onClick={() => this.removeInstrument(instrument.instrument_id, index)}></i>
                        :
                        null;

                        return (
                            <div key={index} className="instrument">
                                <h3>{instrument.name} {removeButton}</h3>
                            </div>
                        )
                    })}
                    { addInstruments }
                </div>

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

                        console.log('MEMBER', member);

                        return (
                            <Card
                                key={index}
                                onClick={() => this.editMember(member)}
                            >
                                <CardHeader
                                    title={`${member.first_name} ${member.last_name}`}
                                    subtitle={member.instrument}
                                    avatar={member.profile_image_url}
                                />
                            </Card>
                        )
                    })}
                    { addMembers }
                </div>
                { confirmDeleteForm }
                <div className="charts">
                    <h3>Charts</h3>
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
                    {addCharts}
                    <Dialog
                        actions={actions}
                        modal={false}
                        open={this.state.showModal}
                        onRequestClose={() => this.displayChartModal(false)}
                    >
                        {this.state.dialogChildren}
                    </Dialog>
                </div>
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
        allInstruments: state.allInstruments,
        apiURL: state.apiURL,
        loggedInUser: state.loggedInUser
    }
}

export default connect(mapStateToProps)(BandPage);
