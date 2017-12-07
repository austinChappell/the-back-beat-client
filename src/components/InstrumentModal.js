import React, { Component } from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class InstrumentModal extends Component {

  handleInstrumentClick = (evt, id) => {
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

    const instrumentIds = this.props.selectedInstrumentIds;
    const index = instrumentIds.indexOf(id);
    if (instrumentIds.includes(id)) {
      instrumentIds.splice(index, 1);
    } else {
      instrumentIds.push(id);
    }

    this.props.updateSelectedInstrumentIds(instrumentIds);

  }

  toggleSelected = (target) => {
    if (target.classList.contains('selected')) {
      target.classList.remove('selected');
    } else {
      target.classList.add('selected');
    }
  }

  updateInstruments = () => {
    const isntrumentIds = this.props.selectedInstrumentIds;
    const apiURL = this.props.apiURL;
    const bandId = this.props.bandId;
    fetch(`${apiURL}/editband/${bandId}/removeinstrument/all?token=${localStorage.token}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'DELETE',
      body: JSON.stringify({
        bandId
      })
    }).then(() => {
      isntrumentIds.forEach((id) => {
        fetch(`${apiURL}/editband/${bandId}/addinstrument/${id}?token=${localStorage.token}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        }).then((response) => {
          return response.json();
        }).then((results) => {
        }).catch((err) => {
          console.log('error', err);
        })
      })
    }).then(() => {
      this.props.displayInstrumentModal(false);
    }).catch((err) => {
      console.log('error', err);
    })
  }

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
                    onClick={(evt) => this.handleInstrumentClick(evt, instrument.instrument_id)}
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
        apiURL: state.apiURL,
        allInstruments: state.allInstruments,
        selectedInstrumentIds: state.selectedInstrumentIds
      }
    }

    const mapDispatchToProps = (dispatch) => {
      return {
        updateSelectedInstrumentIds: (selectedInstrumentIds) => {
          const action = { type: 'UPDATE_SELECTED_INSTRUMENT_IDS', selectedInstrumentIds };
          dispatch(action);
        }
      }
    }

    export default connect(mapStateToProps, mapDispatchToProps)(InstrumentModal);
