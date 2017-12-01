import React, { Component } from 'react';
import { connect } from 'react-redux';

import Slider from './Slider';

class BandMemberMgmt extends Component {

    render() {
        console.log('BAND MEMBER MGMT PROPS', this.props);
        return (
            <div className="BandMemberMgmt">
                <Slider items={this.props.members} instruments={this.props.instruments} />
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
