import React, { Component } from 'react';
import { moment } from 'meteor/momentjs:moment';

export default class ProfileCard extends Component {
  handleMessageClick(event) {
    this.props.callback(this.props.profile.userId);
  }

  handleNameClick(event) {
    this.props.nameClickCallback(this.props.profile.userId);
  }

  handleConnectClick(event) {
    this.props.connectCallback(this.props.profile.userId);
  }

  handleGroupClick(event) {
    this.props.groupClick(this.props.profile.userId);
  }

  render() {
    var handleMessageClick = this.handleMessageClick.bind(this),
      handleNameClick = this.handleNameClick.bind(this),
      handleGroupClick = this.handleGroupClick.bind(this);

    return (
      <div className="item" style={{ display: 'inline-block',
        width: '50%', marginTop: 0 }}>
        <div className="image">
          <img src={this.props.profile.image} />
        </div>
        <div className="content" style={{ paddingLeft: 0, marginTop: '10px' }}>
          <a onClick={handleNameClick} className="header">
            {this.props.profile.name}</a>
          <div className="meta">
            <span className="date">Joined {moment.duration(
              moment(this.props.profile.createdAt)
                .diff(new Date())).humanize()} ago</span>
          </div>
          <div className="extra content">
            <a>
              <i className="user icon"></i>
              {this.props.profile.friends.length}
            </a>
            {' '}
            {this.props.isFriend ? [<a onClick={handleMessageClick}>
              <i className="mail icon"></i>
              Message
            </a>, this.props.getGroup ? <a onClick={handleGroupClick}>
              <i className="plus icon"></i>
              Add to Group
            </a> : null] : <a onClick={handleConnectClick}>
              <i className="plus icon"></i>
              Connect
            </a>}
          </div>
        </div>
      </div>
    );
  }
}
