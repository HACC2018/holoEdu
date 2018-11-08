import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Profiles from './profiles.js';
import { check } from 'meteor/check';

var Resources = new Mongo.Collection('resources');

Resources.schema = new SimpleSchema({
  title: { type: String },
  type: {
    type: String,
    allowedValues: ['multimedia', 'document', 'link']
  },
  url: {
    type: String
  },
  sharer: {
    type: String
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (!this.isSet) return new Date();
      else return this.value;
    }
  },
  likers: {
    type: [String]
  },
  description: {
    type: String
  }
});

export default Resources;

if (Meteor.isServer) {
  Meteor.publish('allResources', function() {
    return Resources.find({ });
  });
}
