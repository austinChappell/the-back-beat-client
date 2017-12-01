import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { DragSource } from 'react-dnd';

/**
* Implements the drag source contract.
*/
const cardSource = {
    beginDrag(props) {
        return {
            text: props.text
        };
    }
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const propTypes = {
  text: PropTypes.string.isRequired,

  // Injected by React DnD:
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired
};

class Slider extends Component {
    render() {

        const { isDragging, connectDragSource, text } = this.props;

        return connectDragSource(
            <div className="Slider" style={{ opacity: isDragging ? 0.5 : 1 }}>
                {this.props.items.map((item, index) => {
                    console.log(item);
                    return (
                        <Card
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

export default DragSource('something', cardSource, collect)(Slider);
