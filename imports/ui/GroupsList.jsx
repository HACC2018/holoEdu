import React, { Component } from 'react';
import GroupItem from './GroupItem.jsx';
import Groups from '../api/groups.js';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

class GroupsList extends Component {
  messageCallback(id) {
    this.props.messageCallback(id);
  }

  createClick(event) {
    this.props.createClick();
  }

  render() {
    var messageCallback = this.messageCallback.bind(this),
      createClick = this.createClick.bind(this);

    return (
      <section className="ui segment container">
        <h2 className="ui header">My Groups</h2>
        <button className="ui icon button blue" onClick={createClick}>
          <i className="plus icon"></i>
          {' '}Create Group
        </button>
        <div className="ui items">
          {this.props.groups.map((group) =>
            <GroupItem group={group} messageCallback={messageCallback} />)}
        </div>
      </section>
    );
  }
}

export default withTracker(({ userId, messageCallback, createClick }) => {
  Meteor.subscribe('groupsDefault', userId);

  return {
    messageCallback: messageCallback,
    createClick: createClick,
    groups: Groups.find({ $or: [
      { creatorUserId: userId },
      { members: userId }
    ] })
  };
})(GroupsList);
