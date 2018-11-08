import React, { Component } from 'react';
import Header from './Header.jsx';
import FriendSearch from './FriendSearch.jsx';
import FriendsList from './FriendsList.jsx';
import InviteSection from './InviteSection.jsx';
import LoginPortal from './LoginPortal.jsx';
import MessagesList from './MessagesList.jsx';
import MessageThread from './MessageThread.jsx';
import Groups from '../api/groups.js';
import GroupsList from './GroupsList.jsx';
import GroupAddModal from './GroupAddModal.jsx';
import GroupCreateModal from './GroupCreateModal.jsx';
import AddResourceModal from './AddResourceModal.jsx';
import ResourceFeed from './ResourceFeed.jsx';
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
      activeMessageThread: '',
      activeViewingProfile: '',
      groupAddee: ''
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

  nameClickCallback(_id) {
    var self = this;
    self.setState({
      activeIconType: 'user',
      activeViewingProfile: _id
    });
  }

  handleBackClick() {
    var self = this;
    self.setState({
      activeIconType: 'user',
      activeViewingProfile: ''
    });
  }

  addFriend(_id) {
    Meteor.call('addFriend', Meteor.userId(), _id);
  }

  groupClick(id) {
    this.setState({ groupAddee: id }, function() {
      $('#group-add-modal').modal('show');
    });
  }

  createClick() {
    $('#group-create-modal').modal('show');
  }

  render() {
    var handleClick = this.handleClick.bind(this),
      messageCallback = this.messageCallback.bind(this),
      addFriend = this.addFriend.bind(this),
      nameClickCallback = this.nameClickCallback.bind(this),
      handleBackClick = this.handleBackClick.bind(this),
      groupClick = this.groupClick.bind(this),
      createClick = this.createClick.bind(this);

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
            <Header id={this.state.activeViewingProfile || Meteor.userId() }
              handleMessageClick={messageCallback} loggedInID={Meteor.userId()}
              handleBackClick={handleBackClick} connectCallback={addFriend} />,
            this.state.activeViewingProfile.length === 0 ? [
              <NotificationSection />,
              <GroupsList messageCallback={messageCallback}
                createClick={createClick} userId={Meteor.userId()} />,
              <GroupCreateModal loggedInID={Meteor.userId()} />,
              <GroupAddModal profileId={this.state.groupAddee}
                loggedInID={Meteor.userId()} />,
              <FriendsList callback={messageCallback}
                nameClickCallback={nameClickCallback}
                getGroup={this.props.groups.length > 0}
                groupClick={groupClick} />,
              <FriendSearch callback={addFriend}
                nameClickCallback={nameClickCallback} />,
              <InviteSection />] : null
          ] : null,
          this.state.activeIconType === 'newspaper' ? [
            <ResourceFeed />,
            <AddResourceModal loggedInID={Meteor.userId()} />
          ] : null,
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
  var groups = Meteor.subscribe('groupsDefault', Meteor.userId());

  return {
    groups: Groups.find({ $or: [
      { creatorUserId: Meteor.userId() },
      { members: Meteor.userId() }
    ] }).fetch(),
    ready: (groups.ready() && handle.ready()) || true,
    currentUser: Meteor.user()
  };
})(Layout);
