import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class GroupItem extends Component {
  messageCallback(event) {
    this.props.messageCallback(this.props.group._id);
  }

  render() {
    var messageCallback = this.messageCallback.bind(this);

    return (
      <div className="item" style={{ display: 'inline-block', width: '50%',
        marginTop: 0 }}>
        <div className="image">
          <img src={Meteor.settings.defaultImage} />
        </div>
        <div className="content" style={{ paddingLeft: 0, marginTop: '10px' }}>
          <a className="header">{this.props.group.name}</a>
          <a className="ui icon">
            <i className="users icon"></i>
            {`${this.props.group.members.length} members`}
          </a>
          <a className="ui icon" onClick={messageCallback}>
            <i className="mail icon"></i>
            Message Group
          </a>
        </div>
      </div>
    );
  }
}
