import React, { Component } from 'react';
import SiteInvitations from '../api/site_invitations.js';
import { moment } from 'meteor/momentjs:moment';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

class InviteSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      collapsed: false
    };
  }

  handleCollapseToggle() {
    this.setState({ collapsed: !this.state.collapsed });
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
    var handleKeyPress = this.handleKeyPress.bind(this),
      handleCollapseToggle = this.handleCollapseToggle.bind(this);

    return (
      <section className="ui segment container">
        <h2 className="ui header" style={{ marginBottom: 0 }}>
          Invite Friends</h2>
        <div style={{ float: 'right', position: 'relative', top: '-25px' }}>
          <p>
            <a className="ui icon" onClick={handleCollapseToggle}
              style={{ fontSize: '24px' }}>
              <i className='expand icon'></i>
              {this.state.collapsed ? 'Expand': 'Collapse'}
            </a>
          </p>
        </div>
        {!this.state.collapsed ? [
          <div className="ui left icon fluid input"
            style={{ marginTop: '15px' }}>
            <input type="text" id="invite-input-email"
              placeholder="Invite by Email" onKeyPress={handleKeyPress} />
            <i className="send icon"></i>
          </div>,
          (this.state.errorMessage && this.state.errorMessage !== '') ?
            <div className="ui error message">
              <p>{this.state.errorMessage}</p>
            </div> : null,
          this.props.invitations.length > 0 ? [
            <h3 className="ui header">Pending Invitations</h3>,
            this.props.invitations.map(
              (invitation) =>
                <div key={invitation._id}>
                  {invitation.email} - invited {moment.duration(
                    moment(invitation.createdAt)
                      .diff(new Date())).humanize()} ago</div>)
          ]: null] : null}
      </section>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('invitationsById', Meteor.userId());

  return {
    invitations: SiteInvitations.find({ inviter: Meteor.userId() }).fetch()
  };
})(InviteSection);
