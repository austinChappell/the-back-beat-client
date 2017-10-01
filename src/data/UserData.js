const url = 'http://localhost:6001';

let UserData = {

  getInstruments: (userId) => {

    const url = this.props.apiURL;
    fetch(`${url}/api/instrumentuser/${this.props.user.id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json();
    }).then((results) => {
      this.setState({ userInstruments: results.rows })
    })

  }

}

export default UserData;
