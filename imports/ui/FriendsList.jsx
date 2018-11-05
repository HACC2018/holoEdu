import React, { Component } from 'react';
import Profiles from '../api/profiles.js';
import ProfileCard from './ProfileCard.jsx';
import { withTracker } from 'meteor/react-meteor-data';

class FriendsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    }
  }

  handleCollapseToggle() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    var handleCollapseToggle = this.handleCollapseToggle.bind(this);

    if (this.props.friends.length > 0) {
      return (
        <section className="ui segment container">
          <h2 className="ui header" style={{ marginBottom: 0 }}>My Friends</h2>
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
            <div className="ui left icon fluid input">
              <input type="text" placeholder="Search..." />
              <i className="search icon"></i>
            </div>,
            this.props.friends.map((friend) =>
              <ProfileCard profile={friend} /> )] : null}
        </section>
      );
    }
    else return null;
  }
}

export default withTracker(() => {
  return {
    friends: Profiles.find({
      userId: { $in: Profiles.findOne({ userId: Meteor.userId() }).friends }
    }).fetch()
  }
})(FriendsList);
