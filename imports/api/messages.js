import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { check } from 'meteor/check';
import Groups from './groups.js';

var Messages = new Mongo.Collection('messages');

Messages.schema = new SimpleSchema({
  content: { type: String },
  thread: { type: String },
  sender: { type: String },
  createdAt: { type: Date }
});

export default Messages;

if (Meteor.isServer) {
  Meteor.publish('messagesDefault', function(userId, threadId) {
    check(userId, String);
    check(threadId, String);
    return Messages.find({ $or: [{
      thread: userId,
      sender: threadId
    }, {
      sender: userId,
      thread: threadId
    }, {
      thread: {
        $in: Groups.find({ $or: [
          { creatorUserId: userId },
          { members: userId }
        ] }).fetch().map((group) => group._id)
      }
    }] }, { $sort: { createdAt: -1 } });
  });

  Meteor.publish('messageHistory', function(userId) {
    check(userId, String);
    return Messages.find({ $or: [
      { thread: userId },
      { sender: userId },
      {
        thread: {
          $in: Groups.find({ $or: [
            { creatorUserId: userId },
            { members: userId }
          ] }).fetch().map((group) => group._id)
        }
      }
    ] });
  });
}
