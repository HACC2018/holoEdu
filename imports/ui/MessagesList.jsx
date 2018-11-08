import React, { Component } from 'react';
import Profiles from '../api/profiles.js';
import Groups from '../api/groups.js';
import { withTracker } from 'meteor/react-meteor-data';
import Messages from '../api/messages.js';
import { _ } from 'underscore';

class MessagesList extends Component {
  handleClick(event) {
    return this.props.callback;
  }

  render() {
    var handleClick = this.handleClick.bind(this);

    return (
      <header className="ui segment container">
        <div className="ui grid">
          <div className="ten wide column">
            <h1 className="ui header">Messages</h1>
            {(this.props.ready &&
              Object.keys(this.props.threads()).length > 0) ?
              Object.keys(this.props.threads()).map((key) =>
                <div style={{ border: 'thin black solid', borderRadius: '2px',
                  padding: '10px', width: '100%' }}
                onClick={(e) => handleClick(e)(key)}>
                  <h3>{(Profiles.findOne({ userId: key }) &&
                      Profiles.findOne({ userId: key }).name || null) ||
                    Groups.findOne({ _id: key }).name }</h3>
                  <p>{Messages.findOne({
                    _id: this.props.threads()[key] }).content}</p>
                </div>) : <h2>No messages.</h2>}
          </div>
        </div>
      </header>
    );
  }
}

export default withTracker(({ callback }) => {
  var s1 = Meteor.subscribe('groupsDefault', Meteor.userId()),
    s2 = Meteor.subscribe('messageHistory', Meteor.userId());
  Meteor.subscribe('allProfiles');

  return {
    ready: s1.ready() && s2.ready(),
    callback: callback,
    threads: function() {
      var received = _.groupBy(Messages.find({
          thread: Meteor.userId()
        }, { $sort: { createdAt: -1 } }).fetch(), 'sender'),
        sent = _.groupBy(Messages.find({
          sender: Meteor.userId()
        }, { $sort: { createdAt: -1 } }).fetch(), 'thread'),
        groupReceived = _.groupBy(Messages.find({
          thread: { $in: Groups.find({ $or: [
            { creatorUserId: Meteor.userId() },
            { members: Meteor.userId() }
          ] }).fetch().map((group) => group._id) }
        }).fetch(), 'thread'), retval = {};
      for (var sender in received) {
        if (!retval[sender]) {
          retval[sender] = received[sender];
        }
      }
      for (var thread in sent) {
        if (retval[thread] === undefined) {
          retval[thread] = sent[thread];
          console.log(retval[thread]);
        }
        else retval[thread] = retval[thread].concat(sent[thread]);
      }
      console.log(retval)
      for (var thread in groupReceived) {
        console.log(retval[thread]);
        if (retval[thread] === undefined) {
          retval[thread] = groupReceived[thread];
        }
        else retval[thread] = retval[thread].concat(groupReceived[thread]);
      }
      console.log(retval)
      for (var key in retval) {
        retval[key] = _.sortBy(retval[key], 'createdAt').reverse()[0]._id;
      }
      return retval;
    }
  };
})(MessagesList);
