import React from 'react';
import { Redirect, Route } from 'react-router-dom';
// import { connect } from 'react-redux';
import store from '../store/';

function PrivateRoute({ component: Component, ...rest }, props) {
  return (
    <Route {...rest} render={(props) => {
      let newProps = store.getState();
      return (
        newProps.authorized ? (
          <Component {...props}/>
        )
      : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }}/>
      )
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
