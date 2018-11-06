import React, { Component } from 'react';
import Profiles from '../api/profiles.js';
import ProfileCard from './ProfileCard.jsx';
import { withTracker } from 'meteor/react-meteor-data';

class FriendSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  handleCollapseToggle() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    var handleCollapseToggle = this.handleCollapseToggle.bind(this);

    if (this.props.nonfriends.length) {
      return (
        <section className="ui segment container">
          <h2 className="ui header" style={{ marginBottom: 0 }}>
            Find Friends</h2>
          <div style={{ float: 'right', position: 'relative', top: '-25px' }}>
            <p>
              <a className="ui icon" onClick={handleCollapseToggle}
                style={{ fontSize: '24px' }}>
                <i className='expand icon'></i>
                {this.state.collapsed ? 'Expand': 'Collapse'}
              </a>
            </p>
          </div>
          <div className="ui left icon fluid input"
            style={{ marginTop: '15px' }}>
            <input type="text" placeholder="Search..." />
            <i className="search icon"></i>
          </div>
          {this.props.nonfriends.map(
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
  Meteor.subscribe('nonfriends', Meteor.userId());

  return {
    nonfriends: Profiles.find({
      userId: { $ne: Meteor.userId() },
      friends: { $nin: [Meteor.userId()] } }).fetch()
  };
})(FriendSearch);
