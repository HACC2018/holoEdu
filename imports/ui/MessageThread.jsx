import React, { Component } from 'react';
import Messages from '../api/messages.js';
import { moment } from 'meteor/momentjs:moment';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Profiles from '../api/profiles.js';
import Groups from '../api/groups.js';

class MessageThread extends Component {
  constructor(props) {
    super(props);
  }

  handleKeyPress(event) {
    var self = this;
    if (event.charCode === 13 && event.target.value.length) {
      Meteor.call('sendMessage', Meteor.userId(), this.props.threadId,
        event.target.value);
      event.target.value = '';
      self.forceUpdate();
    }
  }

  render() {
    var handleKeyPress = this.handleKeyPress.bind(this);

    return (
      <section className="ui segment container">
        <h2 className="ui header">Conversation with{' '}
          {Profiles.findOne({ userId: this.props.threadId }).name ||
            Groups.findOne({ _id: this.props.threadId }).name }</h2>
        <div>
          {this.props.getThread.map((message) =>
            <div>
              <div>
                <p><b>
                  {message.sender !== Meteor.userId() ?
                    Profiles.findOne({ userId: message.sender }).name : 'You'}
                </b>{' '}{moment.duration(
                  moment(message.createdAt).diff(new Date())).humanize() +
                  ' ago'}</p>
                <p>{message.content}</p>
              </div>
            </div>
          )}
        </div>
        <div className="ui left icon fluid input"
          style={{ marginTop: '15px' }}>
          <input type="text" placeholder="Send message..."
            onKeyPress={handleKeyPress}/>
          <i className="mail icon"></i>
        </div>
      </section>
    );
  }
}

export default withTracker(({ threadId }) => {
  var handle = Meteor.subscribe('messagesDefault', Meteor.userId(), threadId);
  Meteor.subscribe('allProfiles');

  return {
    threadId: threadId,
    getThread: Messages.find().fetch()
  };
})(MessageThread);
