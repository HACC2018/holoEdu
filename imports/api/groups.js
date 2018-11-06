import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { check } from 'meteor/check';

var Groups = new Mongo.Collection('groups');

Groups.schema = new SimpleSchema({
  name: { type: String },
  creatorUserId: { type: String },
  members: { type: [String] },
  invitees: { type: [String] },
  createdAt: { type: Date }
});

export default Groups;

if (Meteor.isServer) {
  Meteor.publish('groupsDefault', function(userId) {
    check(userId, String);
    return Groups.find({ $or: [
      { creatorUserId: userId },
      { members: userId }
    ] });
  });
}
