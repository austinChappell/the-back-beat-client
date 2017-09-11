import React, { Component } from 'react';

class Contact extends Component {
  render() {
    return (
      <div className="Contact" id="contact">
        <h1>Drop A Line...</h1>
        <div className="form">
          <input type="text" name="name" placeholder="Full Name" />
          <input type="email" name="email" placeholder="Email" />
          <textarea name="message" placeholder="Message..." rows="5"></textarea>
          <button>Send Message</button>
        </div>
      </div>
    )
  }
}

export default Contact;
