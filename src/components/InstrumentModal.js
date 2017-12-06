import React, { Component } from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class InstrumentModal extends Component {

    handleInstrumentClick = (evt) => {
        console.log(evt);
        console.log(evt.target);
        const self = this;
        let target = evt.target;

        function findParent(target) {

            if (target.classList.contains('icon')) {
                self.toggleSelected(target);
            } else {
                target = target.parentNode;
                findParent(target);
            }

        }

        findParent(target);
    }

    toggleSelected = (target) => {
        if (target.classList.contains('selected')) {
            target.classList.remove('selected');
        } else {
            target.classList.add('selected');
        }
    }

    updateInstruments = () => {

    }

    render() {

        console.log('STATE', this.state);

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={() => this.props.displayInstrumentModal(false)}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onClick={(evt) => this.updateInstruments()}
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
                            let selected = false;
                            this.props.selectedInstrumentIds.forEach((id) => {
                                if (id === instrument.instrument_id) {
                                    selected = true;
                                }
                            })
                            const instrumentClassName = selected ? "icon selected" : "icon";
                            return (
                                <div
                                    className={instrumentClassName}
                                    key={index}
                                    id={instrument.isntrument_id}
                                    onClick={() => this.props.handleInstrumentClick(instrument.instrument_id)}
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
