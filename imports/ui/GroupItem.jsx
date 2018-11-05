import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class GroupItem extends Component {
  render() {
    return (
      <div className="item">
        <div className="image">
          <img src={Meteor.settings.defaultImage} />
        </div>
        <div className="content">
          <a className="header">{this.props.group.name}</a>
          <div className="meta">
            <span>Description</span>
          </div>
          <div className="description" dangerouslySetInnerHTML=
            {{ __html: this.props.group.description }}/>
          <div className="extra ui icon">
            <i className="users icon"></i>
            {`${this.props.groups.members.length} members`}
          </div>
        </div>
      </div>
    );
  }
}
