import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { check } from 'meteor/check';

var Profiles = new Mongo.Collection('profiles');

Profiles.schema = new SimpleSchema({
  name: { type: String },
  school: { type: String },
  subject: { type: String },
  grade_level: {
    type: String,
    allowedValues: ['', 'Elementary', 'Kindergarten', '1st Grade',
      '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
      'Middle/Intermediate', '6th Grade', '7th Grade',
      '8th Grade', 'High', '9th Grade',  '10th Grade',
      '11th Grade', '12th Grade'
    ]
  },
  image: {
    type: String,
    defaultValue: Meteor.settings.defaultImage
  },
  description: { type: String },
  interests: { type: [String] },
  points: { type: Number },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (!this.isSet) return new Date();
      else return this.value;
    }
  },
  friends: { type: [String] }
});

export default Profiles;

if (Meteor.isServer) {
  Meteor.publish('singleProfile', function(userId) {
    check(userId, String);
    return Profiles.find({ userId: userId });
  });

  Meteor.publish('allProfiles', function() {
    return Profiles.find();
  });

  Meteor.publish('friendsProfiles', function(userId) {
    check(userId, String);
    return Profiles.find({ friends: userId });
  });

  Meteor.publish('nonfriends', function(userId) {
    check(userId, String);
    return Profiles.find({ userId: { $ne: userId },
      friends: { $nin: [userId] } });
  });
}
