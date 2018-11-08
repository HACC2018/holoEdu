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

  nameClickCallback(_id) {
    this.props.nameClickCallback(_id);
  }

  handleCollapseToggle() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  connectCallback(id) {
    this.props.connectCallback(id);
  }

  groupClick(id) {
    this.props.groupClick(id);
  }

  render() {
    var handleCollapseToggle = this.handleCollapseToggle.bind(this),
      callback = this.callback.bind(this),
      nameClickCallback = this.nameClickCallback.bind(this),
      connectCallback = this.connectCallback.bind(this),
      groupClick = this.groupClick.bind(this),
      getGroup = this.props.getGroup;

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
              style={{ marginTop: '15px', marginBottom: '15px' }}>
              <input type="text" placeholder="Search..." />
              <i className="search icon"></i>
            </div>,
            <div className="ui items" style={{ display: 'inline' }}>
              {this.props.friends.map((friend) =>
                <ProfileCard key={friend._id} profile={friend} isFriend={true}
                  callback={callback} nameClickCallback={nameClickCallback}
                  connectCallback={connectCallback} groupClick={groupClick}
                  getGroup={getGroup} />)}
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
