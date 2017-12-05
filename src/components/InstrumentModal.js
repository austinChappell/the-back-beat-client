import React, { Component } from 'react';

import FlatButton from 'material-ui/FlatButton';

class InstrumentModal extends Component {
    render() {
        return (
            <div className="InstrumentModal" style={{ display: this.props.show ? 'flex' : 'none' }}>
                <div className="modal">
                    <h1>Edit Instrumentaion</h1>
                    <div className="instruments">
                        <div className="icon">
                            <img src={require("../assets/images/instrument_icons/icons8-accordion.png")} alt="Accordion" />
                            <span>Accordion</span>
                        </div>
                        <div className="icon selected">
                            <img src={require("../assets/images/instrument_icons/icons8-drum_set.png")} alt="Drum Set" />
                            <span>Drum Set</span>
                        </div>
                        <div className="icon selected">
                            <img src={require("../assets/images/instrument_icons/icons8-guitar.png")} alt="Acoustic Guitar" />
                            <span>Ac. Guit.</span>
                        </div>
                        <div className="icon">
                            <img src={require("../assets/images/instrument_icons/icons8-microphone2.png")} alt="Voice (soprano)" />
                            <span>Voice (Sop)</span>
                        </div>
                    </div>
                    <FlatButton
                        label="Cancel"
                        primary={true}
                        onClick={() => this.displayChartModal(false)}
                    />
                    <FlatButton
                        label="Update"
                        primary={true}
                        onClick={(evt) => this.addChart(evt)}
                    />
                </div>
            </div>
        )
    }
}

export default InstrumentModal;
