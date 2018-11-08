import React, { Component } from 'react';
import Groups from '../api/groups.js';
import Profiles from '../api/profiles.js';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

class GroupAddModal extends Component {
  handleClick(event) {
    return function(user, group) {
      Groups.update({ _id: group }, { $push: { members: user } });
    }
  }

  render() {
    var handleClick = this.handleClick.bind(this);

    if (this.props.profile !== null) return (
      <div id="group-add-modal" className="ui modal">
        <i class="close icon"></i>
        <div class="header">
          Add {this.props.profile.name} to Group
        </div>
        <div class="image content">
          <div class="description">
            To which group do you want to add {this.props.profile.name}?
            <div className="ui items">
              {this.props.groups.map((group) =>
                <div onClick={(e) =>
                  handleClick(e)(this.props.profile.userId, group._id)}
                className="item" style={{ display: 'inline-block',
                  width: '50%', marginTop: 0 }}>
                  <div className="image">
                    <img src={Meteor.settings.defaultImage} />
                  </div>
                  <div className="content"
                    style={{ paddingLeft: 0, marginTop: '10px' }}>
                    <a className="header">{group.name}</a>
                    <div className="extra ui icon">
                      <i className="users icon"></i>
                      {`${group.members.length} members`}
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    );
    else return null;
  }
}

export default withTracker(({ loggedInID, profileId }) => {
  Meteor.subscribe('groupsDefault', loggedInID);
  Meteor.subscribe('singleProfile', profileId);

  return {
    profile: profileId.length !== 0 ? Profiles.findOne({ userId: profileId }) :
      null,
    groups: Groups.find({ $or: [
      { creatorUserId: loggedInID },
      { members: loggedInID }
    ] }).fetch()
  };
})(GroupAddModal);
