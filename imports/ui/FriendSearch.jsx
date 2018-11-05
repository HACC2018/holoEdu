import React, { Component } from 'react';
import Profiles from '../api/profiles.js';
import ProfileCard from './ProfileCard.jsx';

export default class FriendSearch extends Component {
  render() {
    var friends = Profiles.findOne({ userId: Meteor.userId() }).friends,
      nonfriends = Profiles.find({
        userId: { $nin: friends, $ne: Meteor.userId() }
      });
    if (nonfriends.count() > 0) {
      return (
        <section className="ui segment container">
          <h2 className="ui header">Find Friends</h2>
          <div className="ui left icon fluid input">
            <input type="text" placeholder="Search..." />
            <i className="search icon"></i>
          </div>
          {nonfriends.map((nonfriend) => <ProfileCard profile={nonfriend} /> )}
          <p className="ui one column center aligned grid">
            <button className="ui button blue">More</button>
          </p>
        </section>
      );
    }
    else return null;
  }
}
