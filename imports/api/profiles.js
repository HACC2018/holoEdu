import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

var Profiles = new Mongo.Collection('profiles');

Profiles.schema = new SimpleSchema({
  firstName: { type: String },
  lastName: { type: String },
  school: { type: String },
  subject: { type: String },
  interests: { type: [String] },
  invitees: { type: [String] },
  points: { type: Number },
  createdAt: { type: Date }
});

export default Profiles;
