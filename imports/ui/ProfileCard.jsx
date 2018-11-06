import React, { Component } from 'react';
import { moment } from 'meteor/momentjs:moment';

export default class ProfileCard extends Component {
  handleMessageClick(event) {
    this.props.callback(this.props.profile.userId);
  }

  render() {
    var handleMessageClick = this.handleMessageClick.bind(this);

    return (
      <div className="item">
        <div className="image">
          <img src={this.props.profile.image} />
        </div>
        <div className="content">
          <a className="header">{this.props.profile.name}</a>
          <div className="meta">
            <span className="date">Joined {moment.duration(
              moment(this.props.profile.createdAt)
                .diff(new Date())).humanize()} ago</span>
          </div>
          <div className="description"
            dangerouslySetInnerHTML=
              {{ __html: this.props.profile.description }} />
          <div className="extra content">
            <a>
              <i className="user icon"></i>
              {this.props.profile.friends.length}
            </a>
            {' '}
            <a onClick={handleMessageClick}>
              <i className="mail icon"></i>
              Message
            </a>
          </div>
        </div>
      </div>
    );
  }
}
