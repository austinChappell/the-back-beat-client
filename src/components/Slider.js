import React, { Component } from 'react';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

class Slider extends Component {
    render() {

        console.log('SLIDER PROPS', this.props);

        return (
            <div className="Slider">
                {this.props.items.map((item, index) => {
                    console.log(item);
                    return (
                        <div
                            className="card"
                            key={index}
                        >
                            <div className="header">
                                <h3>{item.title}</h3>
                                <SelectField
                                  floatingLabelText="Assign Instrument"
                                  onChange={this.filterSearch}
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
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Slider;
