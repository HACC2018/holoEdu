import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

var Groups = new Mongo.Collection('groups');

Groups.schema = new SimpleSchema({
  name: { type: String },
  creatorUserId: { type: String },
  members: { type: [String] },
  invitees: { type: [String] },
  createdAt: { type: Date }
});

export default Groups;
