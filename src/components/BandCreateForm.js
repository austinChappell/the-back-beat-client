import React, { Component } from 'react';

class BandCreateForm extends Component {

  render() {
    return (
      <div className="BandCreateForm">
        <form>
          <div className="form-group">
            <label>Band Name:</label>
            <input />
          </div>
          <div className="form-group">
            <label>Genre:</label>
            <select>
              <option value="rock">Rock</option>
              <option value="jazz">Jazz</option>
              <option value="country">Country</option>
            </select>
          </div>
          <div className="form-group">
            <label>Skill Level:</label>
            <select>
              <option value="pro">Professional</option>
              <option value="semi-pro">Semi-Professional</option>
              <option value="amateur">Amateur</option>
              <option value="novice">Novice</option>
            </select>
          </div>
          <div className="form-group">
            <label>City:</label>
            <select>
              <option>Austin, TX</option>
              <option>Dallas, TX</option>
            </select>
          </div>
          <div className="form-group">
            <label>Members:</label>
            <input type="text" /><button><i className="fa fa-plus" aria-hidden="true"></i></button>
          </div>
          <button>Create Band</button>
        </form>
      </div>
    )
  }
}

export default BandCreateForm;
