import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { check } from 'meteor/check';

var Notifications = new Mongo.Collection('notifications');

Notifications.schema = new SimpleSchema({
  recipient: { type: String },
  content: { type: String },
  created: { type: Date },
  read: { type: Boolean },
  notificationType: {
    type: String,
    allowedValues:
      ['user', 'users', 'mail', 'thumbs up', 'trophy', 'attachment']
  }
});

export default Notifications;

if (Meteor.isServer) {
  Meteor.publish('notificationsDefault', function(userId) {
    check(userId, String);
    return Notifications.find({ recipient: userId, read: false },
      { $sort: { createdAt: -1 } });
  });
}
