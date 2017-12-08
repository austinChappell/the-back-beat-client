import React, { Component } from 'react';
import { connect } from 'react-redux';

import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Slider from './Slider';

class BandMemberMgmt extends Component {

  state = {
    instrumentFilter: -2
  }

  filterInstruments = (evt, index, value) => {
    console.log('evt', evt);
    console.log('index', index);
    console.log('value', value);
    this.setState({ instrumentFilter: value });
  }

  render() {
    return (
      <div className="BandMemberMgmt">

        <SelectField
          floatingLabelText="Filter By Instrument"
          onChange={this.filterInstruments}
          style={{textAlign: 'left', width: '250px'}}
          value={this.state.instrumentFilter}
        >
          <MenuItem
            key={-2}
            value={-2}
            primaryText={'All Instruments'}
          />
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

        <Slider
          adminId={this.props.adminId}
          assignInstrument={this.props.assignInstrument}
          instrumentFilter={this.state.instrumentFilter}
          items={this.props.members}
          removeMember={this.props.removeMember}
          setEditingUser={this.props.setEditingUser}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    bandInstruments: state.bandInstruments
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BandMemberMgmt);
