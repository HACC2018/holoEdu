import React, { Component } from 'react';
import Messages from '../api/messages.js';
import { moment } from 'meteor/momentjs:moment';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Profiles from '../api/profiles.js';
import Groups from '../api/groups.js';

class MessageNode extends Component {
  render() {
    return (
      <div style={{ border: 'thin black solid', borderRadius: '2px',
        padding: '10px' }}>
        <div>
          <p style={{ marginBottom: 0 }}><b>
            {this.props.message.sender !== Meteor.userId() ?
              Profiles.findOne({
                userId: this.props.message.sender }).name : 'You'}
          </b>{' '}{moment.duration(
            moment(this.props.message.createdAt).diff(new Date())).humanize() +
            ' ago'}</p>
          <p>{this.props.message.content}</p>
        </div>
      </div>
    );
  }
}

class MessageThread extends Component {
  componentDidMount() {
    document.getElementById('bottom').scrollIntoView({
      behavior: 'smooth'
    });
  }

  componentWillUnmount() {
    this.props.stop();
  }

  componentDidUpdate() {
    document.getElementById('bottom').scrollIntoView({
      behavior: 'smooth'
    });
  }

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
          {(Profiles.findOne({ userId: this.props.threadId }) &&
            Profiles.findOne({ userId: this.props.threadId }).name || null) ||
            (Groups.findOne({ _id: this.props.threadId }) &&
            Groups.findOne({ _id: this.props.threadId }).name || null) }</h2>
        <div style={{ height: '225px', overflowY: 'scroll' }}>
          {this.props.getThread.map((message) =>
            <MessageNode message={message} /> )}
          <div id="bottom"></div>
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
    stop: function() { handle.stop(); },
    threadId: threadId,
    getThread:
      Messages.find({ $or: !Groups.findOne({ _id: threadId }) ? [{
        thread: Meteor.userId(),
        sender: threadId
      }, {
        sender: Meteor.userId(),
        thread: threadId
      }] : [ { thread: threadId } ] }, {
        $sort: { createdAt: -1 }
      }).fetch()
  };
})(MessageThread);
