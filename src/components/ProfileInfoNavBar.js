import React, { Component } from 'react';
import { connect } from 'react-redux';

class ProfileInfoNavBar extends Component {

  constructor() {
    super();

    this.state = {
      navBarItems: [
        { value: 'main', text: 'Info', active: true },
        { value: 'events', text: 'Events', active: false },
        // { value: 'connections', text: 'Connections', active: false },
        { value: 'bands', text: 'Bands', active: false },
        { value: 'uploads', text: 'Uploads', active: false },
      ]
    }

  }

  componentDidMount() {
    this.props.changeProfileContent(this.state.navBarItems[0].value);
  }

  highlightNavItem = (itemValue, index) => {
    let newList = this.state.navBarItems.slice();
    let selectedItem = newList.find((item) => item.active);
    selectedItem.active = false;
    newList[index].active = true;
    this.setState({ navBarItems: newList });
    console.log('new state', this.state);
    this.props.changeProfileContent(itemValue);
  }

  render() {
    return (
      <div className="ProfileInfoNavBar">
        {this.state.navBarItems.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => this.highlightNavItem(item.value, index)}
              className={item.active ? "active tab" : "tab"}>
                {item.text}
            </div>
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // oldElem: state.profileNav.inactive,
    // newElem: state.profileNav.active
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeProfileContent: (value) => {
      // let newElem = evt.target;
      const action = { type: 'CHANGE_PROFILE_CONTENT', value };
      dispatch(action);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfoNavBar);
