import React, { Component } from 'react';
import Resources from '../api/resources.js';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

class AddResourceModal extends Component {
  handleClick() {
    Meteor.call('addResource', $('#resource-title').val(),
      $('#resource-type').val(), $('#resource-link').val(),
      this.props.loggedInID, $('#resource-desc').val());
    $('#resource-add-modal').modal('hide');
  }

  render() {
    var handleClick = this.handleClick.bind(this);

    return (
      <div id="resource-add-modal" className="ui modal">
        <i class="close icon"></i>
        <div class="header">
          Add Resources
        </div>
        <div class="content">
          <div class="input">
            <input type="text" id="resource-title" placeholder="Title" />
            <input type="text" id="resource-link" placeholder="Link" />
            <input type="text" id="resource-desc" placeholder="Description" />
            <select id="resource-type">
              <option value="multimedia">Multimedia</option>
              <option value="document">Document</option>
              <option value="document">Link</option>
            </select>
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
})(AddResourceModal);
