import React, { Component } from 'react';
import SiteInvitations from '../api/site_invitations.js';
import { moment } from 'meteor/momentjs:moment';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

class InviteSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: ''
    };
  }

  handleKeyPress(event) {
    var self = this;
    if (event.charCode === 13) {
      if (event.target.value.indexOf('@') !== -1) {
        var taken = this.emailTaken(event.target.value);
        if (taken) {
          switch (taken) {
          case 1:
            this.setState({
              errorMessage: 'User under email address already exists.'
            });
            break;
          case 2:
            this.setState({
              errorMessage: 'Invitation with email address already pending.'
            });
            break;
          }
        }
        else {
          Meteor.call('insertInvitation', Meteor.userId(), event.target.value);
          event.target.value = '';
        }
      }
      else this.setState({
        errorMessage: 'Invalid email address.'
      });
    }
    this.forceUpdate();
  }

  emailTaken(email) {
    if (Meteor.users.findOne({ 'emails.0.address': email })) {
      return 1;
    }
    else if (SiteInvitations.find({ email: email }).count() > 0) {
      return 2;
    }
    return 0;
  }

  render() {
    var handleKeyPress = this.handleKeyPress.bind(this);

    return (
      <section className="ui segment container">
        <h2 className="ui header">Invite Friends</h2>
        <div className="ui left icon fluid input">
          <input type="text" id="invite-input-email"
            placeholder="Invite by Email" onKeyPress={handleKeyPress}/>
          <i className="send icon"></i>
        </div>
        {(this.state.errorMessage && this.state.errorMessage !== '') ?
          <div className="ui error message">
            <p>{this.state.errorMessage}</p>
          </div> : null}
        {this.props.invitations.length > 0 ? [
          <h3 className="ui header">Pending Invitations</h3>,
          this.props.invitations.map(
            (invitation) =>
              <div>{invitation.email} - invited {moment.duration(
                moment(invitation.createdAt)
                  .diff(new Date())).humanize()} ago</div>),
          <p className="ui one column center aligned grid">
            <button className="ui button blue">More</button>
          </p>
        ]: null}
      </section>
    );
  }
}

export default withTracker(() => {
  return {
    invitations: SiteInvitations.find({ inviter: Meteor.userId() }).fetch()
  };
})(InviteSection);
