import React, { Component } from 'react';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class Slider extends Component {
    render() {

        console.log('SLIDER PROPS', this.props);

        return (
            <div className="Slider">
                {this.props.items.map((item, index) => {
                    console.log(item);
                    return (
                        <Card
                            draggable={true}
                            style={{ width: '200px' }}
                        >
                            <CardHeader
                                title={item.title}
                                subtitle={item.subtitle}
                                subtitleStyle={{ whiteSpace: 'nowrap' }}
                                titleStyle={{ whiteSpace: 'nowrap' }}
                            />
                            <CardMedia>
                                <img src={item.avatar} alt={item.title} />
                            </CardMedia>
                        </Card>
                    )
                })}
            </div>
        )
    }
}

export default Slider;
