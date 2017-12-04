import React, { Component } from 'react';
import { connect } from 'react-redux';

import Slider from './Slider';

class BandMemberMgmt extends Component {

    render() {
        console.log('BAND MEMBER MGMT PROPS', this.props);
        return (
            <div className="BandMemberMgmt">
                <Slider
                    adminId={this.props.adminId}
                    assignInstrument={this.props.assignInstrument}
                    items={this.props.members}
                    instruments={this.props.instruments}
                    removeMember={this.props.removeMember}
                    setEditingUser={this.props.setEditingUser}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BandMemberMgmt);
