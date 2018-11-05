import React, { Component } from 'react';
import $ from 'jquery';
import { Meteor } from 'meteor/meteor';
import 'meteor/accounts-password';
import SiteInvitations from '../api/site_invitations.js';

export default class LoginPortal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      onLogin: true
    }
  }

  login() {
    Meteor.loginWithPassword(
      { email: $('#login-input-email').val() },
      $('#login-input-password').val(),
      (error) => {
        if (error) console.log(error);
        if (error) self.setState({ errorMessage: error.message });
      });
  }

  handleClick(event) {
    if ($('#login-input-email').val().length > 0 &&
      $('#login-input-password').val().length > 0) {
      this.login();
    }
    else {
      this.setState({ errorMessage: 'Incomplete form.' });
    }
  }

  acceptInvite() {
    if (SiteInvitations.findOne({
      email: $('#login-input-email').val()
    })._id !== $('#login-input-invite-code').val() ||
      SiteInvitations.findOne({
        _id: $('#login-input-invite-code').val()
      }).email !== $('#login-input-email').val()) {
      this.setState({ error: 'Invalid email or invitation code.' });
    }
    else {
      var id = Accounts.createUser({
        username: $('#login-input-email'),
        email: $('#login-input-email'),
        password: $('#login-input-password')
      });

      Profiles.insert({
        userId: id,
        name: $('#login-input-name'),
        image: Meteor.settings.defaultImage,
        points: 0,
        subject: '',
        school: '',
        interests: [],
        createdAt: new Date(),
        friends: [
          SiteInvitations.findOne({
            _id: $('#login-input-invite-code').val() }).inviter
        ]
      });

      SiteInvitations.remove({ _id: $('#login-input-invite-code').val() });
    }
  }

  handleInviteClick(event) {
    if ($('#login-input-invite-code').val().length > 0 &&
        $('#login-input-email').val().length > 0 &&
        $('#login-input-password').val().length > 0 &&
        $('#login-input-name').val().length > 0) {
      this.acceptInvite();
    } else this.setState({ errorMessage: 'Incomplete form.' })
  }

  render() {
    var handleClick = this.handleClick.bind(this),
      handleInviteClick = this.handleInviteClick.bind(this);

    if (this.state.onLogin) return (
      <div className="ui segment container">
        <h2 className="ui header">Login</h2>
        {this.state.errorMessage && this.state.errorMessage !== '' &&
          <div className="ui error message">
            <p>{this.state.errorMessage}</p>
          </div> || null}
        <div className="ui left icon fluid input">
          <input id="login-input-email" type="text"
            placeholder="Email" />
          <i className="mail icon"></i>
        </div>
        <div className="ui left icon fluid input">
          <input id="login-input-password" type="password"
            placeholder="Password" />
          <i className="key icon"></i>
        </div>
        <button className="ui icon button blue"
          onClick={handleClick}>
          <i className="sign in icon"></i>
          {' '}
          Sign in
        </button>
        { SiteInvitations.find().count() ? <button className="ui button blue"
          onClick={handleClick}>
          Enter Invite Code.
        </button> : null }
      </div>
    );
    else {
      <div className="ui segment container">
        <h2 className="ui header">Accept Invitation</h2>
        {this.state.errorMessage &&
          <div className="ui error message">
            <p>{this.state.errorMessage}</p>
          </div> || null}
        <div className="ui left icon fluid input">
          <input id="login-input-email" type="text"
            placeholder="Email" />
          <i className="mail icon"></i>
        </div>
        <div className="ui left icon fluid input">
          <input id="login-input-name" type="text"
            placeholder="Name" />
          <i className="user icon"></i>
        </div>
        <div className="ui left icon fluid input">
          <input id="login-input-password" type="password"
            placeholder="Password" />
          <i className="key icon"></i>
        </div>
        <div className="ui left icon fluid input">
          <input id="login-input-invite-code" type="password"
            placeholder="Invitation Code" />
          <i className="key icon"></i>
        </div>
        <button className="ui icon button blue"
          onClick={handleInviteClick}>
          <i className="sign in icon"></i>
          {' '}
          Accept Invite
        </button>
      </div>
    }
  }
}
