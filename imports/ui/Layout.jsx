import React, { Component } from 'react';
import Header from './Header.jsx';
import FriendSearch from './FriendSearch.jsx';
import FriendsList from './FriendsList.jsx';
import InviteSection from './InviteSection.jsx';
import LoginPortal from './LoginPortal.jsx';
import MessagesList from './MessagesList.jsx';
import MessageThread from './MessageThread.jsx';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import NotificationSection from './NotificationSection.jsx';

class Icon extends Component {
  render() {
    return (
      <a className={`item ${this.props.active ? 'active' : ''}`}
        onClick={this.props.onClick}>
        <i className={`large ${this.props.iconType} icon`}></i>
      </a>
    );
  }
}


class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIconType: 'user',
      activeMessageThread: ''
    };
  }

  handleClick(event) {
    var self = this;

    return function(type) {
      if (event.target.className.indexOf('active') < 0) {
        self.setState({
          activeIconType: type
        });
      }
    };
  }

  componentDidMount() {
    this.forceUpdate();
  }

  messageCallback(_id) {
    var self = this;
    self.setState({
      activeIconType: 'rocketchat',
      activeMessageThread: _id
    });
  }

  render() {
    var handleClick = this.handleClick.bind(this),
      messageCallback = this.messageCallback.bind(this);

    return (
      <div>
        {this.props.ready && !!this.props.currentUser ? [
          <nav className="ui three item inverted menu">
            <Icon iconType='user'
              active={this.state.activeIconType === 'user'}
              onClick={(e) => { handleClick(e)('user'); }} />
            <Icon iconType='newspaper'
              active={this.state.activeIconType === 'newspaper'}
              onClick={(e) => { handleClick(e)('newspaper'); }} />
            <Icon iconType='rocketchat'
              active={this.state.activeIconType === 'rocketchat'}
              onClick={(e) => { handleClick(e)('rocketchat'); }} />
          </nav>,
          this.state.activeIconType === 'user' ? [
            <Header />,
            <NotificationSection />,
            <FriendsList callback={messageCallback} />,
            <FriendSearch />,
            <InviteSection />
          ] : null,
          this.state.activeIconType === 'newspaper' ? null : null,
          this.state.activeIconType === 'rocketchat' ? [
            <MessagesList callback={messageCallback} />,
            this.state.activeMessageThread !== '' ?
              <MessageThread threadId={this.state.activeMessageThread} /> :
              null
          ] : null
        ] : <LoginPortal />}
      </div>
    );
  }
}

export default withTracker(() => {
  var handle = Meteor.subscribe('user');

  return {
    ready: handle.ready() || true,
    currentUser: Meteor.user()
  };
})(Layout);
