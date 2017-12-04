import React, { Component } from 'react';

import { connect } from 'react-redux';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

class Slider extends Component {

    render() {

        console.log('SLIDER PROPS', this.props);
        console.log('SLIDER STATE', this.state);

        return (
            <div className="Slider">
                {this.props.items.map((item, index) => {
                    const isAdmin = this.props.adminId === this.props.loggedInUser.id;
                    const removeMember = isAdmin && this.props.loggedInUser.id !== item.id ? <div className="remove-member-button">
                        <button
                            onClick={() => this.props.removeMember(item.id)}
                        >
                            Remove
                        </button>
                    </div> : null;
                    console.log(item);
                    return (
                        <div
                            className="card"
                            key={index}
                            onClick={() => this.props.setEditingUser(item.id)}
                        >
                            <div className="header">
                                <h3>{item.title}</h3>
                                <SelectField
                                  floatingLabelText="Assign Instrument"
                                  onChange={this.props.assignInstrument}
                                  style={{textAlign: 'left', width: '150px'}}
                                  value={item.instrument_id}
                                >
                                    {this.props.instruments.map((instrument, index) => {
                                        return (
                                            <MenuItem
                                                key={index}
                                                value={instrument.instrument_id}
                                                primaryText={instrument.name}
                                            />
                                        )
                                    })}
                                </SelectField>

                            </div>
                            <div className="card-image">
                                <img src={item.avatar} alt={item.title} />
                            </div>
                            {removeMember}
                        </div>
                    )
                })}
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

export default connect(mapStateToProps)(Slider);
