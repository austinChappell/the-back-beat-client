import React from 'react';
import { Redirect, Route } from 'react-router-dom';
// import { connect } from 'react-redux';
import store from '../store/';

function PrivateRoute({ component: Component, ...rest }, props) {
  return (
    <Route {...rest} render={(props) => {
      let newProps = store.getState();
      console.log('NEW PROPS', newProps);
      let component;

      if (newProps.authorized) {
        component = <Component {...props}/>
      } else {
        component = <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }}/>
      }
      return (
        component
      )}
    }/>
  )
}

// const mapStateToProps = (state) => {
//   return {
//     authorized: state.authorized
//   }
// }

export default PrivateRoute;
