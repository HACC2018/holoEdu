import React, { Component } from 'react';
import Nav from './Nav.jsx';
import Header from './Header.jsx';
import FriendSearch from './FriendSearch.jsx';
import FriendsList from './FriendsList.jsx';
import InviteSection from './InviteSection.jsx';
import LoginPortal from './LoginPortal.jsx';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import NotificationSection from './NotificationSection.jsx';

class Layout extends Component {
  componentDidMount() {
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        {this.props.ready && !!this.props.currentUser ? [
          <Nav />,
          <Header />,
          <NotificationSection />,
          <FriendsList />,
          <FriendSearch />,
          <InviteSection />] :
          <LoginPortal />}
      </div>
    );
  }
}

export default withTracker(() => {
  var handle = Meteor.subscribe('user');

  return {
    ready: handle.ready() || true,
    currentUser: Meteor.user() || null
  };
})(Layout);