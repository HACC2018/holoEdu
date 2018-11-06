import React, { Component } from 'react';
import Profiles from '../api/profiles.js';
import ProfileCard from './ProfileCard.jsx';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

class FriendsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    }
  }

  callback(_id) {
    this.props.callback(_id);
  }

  handleCollapseToggle() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    var handleCollapseToggle = this.handleCollapseToggle.bind(this),
      callback = this.callback.bind(this);

    if (this.props.ready && this.props.friends.length > 0) {
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
            <div className="ui left icon fluid input"
              style={{ marginTop: '15px' }}>
              <input type="text" placeholder="Search..." />
              <i className="search icon"></i>
            </div>,
            <div data-slick='{"slidesToShow": 4, "slidesToScroll": 4}'>
              {this.props.friends.map((friend) =>
                <ProfileCard profile={friend} callback={callback} />)}
            </div>] : null}
        </section>
      );
    }
    else return null;
  }
}

export default withTracker(() => {
  var sub = Meteor.subscribe('friendsProfiles', Meteor.userId());

  return {
    ready: sub.ready(),
    friends: Profiles.find({ friends: Meteor.userId() }).fetch()
  }
})(FriendsList);
