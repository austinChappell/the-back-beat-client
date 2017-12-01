import React, { Component } from 'react';
import { connect } from 'react-redux';

import Slider from './Slider';

class BandMemberMgmt extends Component {

    state = {
        hasMembers: false,
        membersAsItems: []
    }

    componentDidUpdate() {
        if (!this.state.hasMembers) {
            this.membersToItems();
        }
    }

    membersToItems = () => {
        const output = [];
        this.props.members.forEach((member) => {
            console.log('MEMBER', member);
            const item = {
                title: `${member.first_name} ${member.last_name}`,
                subtitle: 'Instrument Goes Here',
                avatar: member.profile_image_url
            }
            output.push(item);
        })
        if (output.length > 0) {
            this.setState({ hasMembers: true, membersAsItems: output });
        }
    }

    render() {
        return (
            <div className="BandMemberMgmt">
                <Slider items={this.state.membersAsItems}/>
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
