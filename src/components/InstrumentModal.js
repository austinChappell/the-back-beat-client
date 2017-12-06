import React, { Component } from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class InstrumentModal extends Component {
    render() {

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={() => this.props.displayInstrumentModal(false)}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onClick={(evt) => this.addChart(evt)}
            />,
        ];

        return (
            <Dialog
                actions={actions}
                modal={false}
                open={this.props.show}
                onRequestClose={() => this.props.displayInstrumentModal(false)}
            >
                <div className="InstrumentModal">
                    <h1>Edit Instrumentaion</h1>
                    <div className="instruments">
                        {this.props.allInstruments.map((instrument, index) => {
                            return (
                                <div
                                    className="icon"
                                    key={index}
                                    id={instrument.isntrument_id}
                                >
                                    <img src={instrument.icon} alt={instrument.name} />
                                    <span>{instrument.short_label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Dialog>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        allInstruments: state.allInstruments
    }
}

export default connect(mapStateToProps)(InstrumentModal);
