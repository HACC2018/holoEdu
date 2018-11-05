import React, { Component } from 'react';
import Profiles from '../api/profiles.js';
import ProfileCard from './ProfileCard.jsx';
import { withTracker } from 'meteor/react-meteor-data';

class FriendSearch extends Component {
  render() {
    if (this.props.nonfriends.count() > 0) {
      return (
        <section className="ui segment container">
          <h2 className="ui header">Find Friends</h2>
          <div className="ui left icon fluid input">
            <input type="text" placeholder="Search..." />
            <i className="search icon"></i>
          </div>
          {this.props.nonfriends.fetch().map(
            (nonfriend) => <ProfileCard profile={nonfriend} /> )}
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
    nonfriends: Profiles.find({
      userId: { $nin: Profiles.findOne({ userId: Meteor.userId() }).friends,
        $ne: Meteor.userId() }
    })
  };
});