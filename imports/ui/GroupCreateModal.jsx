import React, { Component } from 'react';
import Groups from '../api/groups.js';
import Profiles from '../api/profiles.js';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

class GroupCreateModal extends Component {
  handleClick(event) {
    if ($('#group-name-input').val().length > 0) {
      Meteor.call('createGroup', $('#group-name-input').val(),
        this.props.loggedInID);
      $('#group-create-modal').modal('hide');
    }
  }

  render() {
    var handleClick = this.handleClick.bind(this);

    return (
      <div id="group-create-modal" className="ui modal">
        <i class="close icon"></i>
        <div class="header">
          Create Group
        </div>
        <div class="content">
          <div class="input">
            <input type="text" id="group-name-input" placeholder="Name" />
            <button className="ui blue" onClick={handleClick}>Create</button>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(({ loggedInID }) => {
  return {
    loggedInID: loggedInID
  };
})(GroupCreateModal);
