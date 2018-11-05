import React, { Component } from 'react';
import Profiles from '../api/profiles.js';
import ProfileCard from './ProfileCard.jsx';
import { withTracker } from 'meteor/react-meteor-data';

class FriendsList extends Component {
  render() {
    if (this.props.friends.length > 0) {
      return (
        <section className="ui segment container">
          <h2 className="ui header">My Friends</h2>
          <div className="ui left icon fluid input">
            <input type="text" placeholder="Search..." />
            <i className="search icon"></i>
          </div>
          {this.props.friends.map(
            (friend) => <ProfileCard profile={friend} /> )}
          <p className="ui one column center aligned grid">
            <button className="ui button blue">More</button>
          </p>
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
