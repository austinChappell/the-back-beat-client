import React, { Component } from 'react';

import { connect } from 'react-redux';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

class Slider extends Component {

  render() {

    const filter = this.props.instrumentFilter;

    const musicians = this.props.items.filter((member) => {
      if (member.instrument_id === filter || filter === -2) {
        return member;
      }
    })

    let sliderContent = musicians.map((item, index) => {
      const isAdmin = this.props.adminId === this.props.loggedInUser.id;
      const removeMember = isAdmin && this.props.loggedInUser.id !== item.id ? <div className="remove-member-button">
        <button
          onClick={() => this.props.removeMember(item.id)}
          >
            Remove
          </button>
        </div> : null;
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
                    <MenuItem
                      key={-1}
                      value={-1}
                      primaryText={'Unassigned'}
                    />
                    {this.props.bandInstruments.map((instrument, index) => {
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
          })

          if (musicians.length === 0) {
            sliderContent = <div className="no-results">
              <p>There are no musicians who play this instrument.</p>
            </div>
          }

    return (
      <div className="Slider">

        {sliderContent}
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

      export default connect(mapStateToProps)(Slider);
