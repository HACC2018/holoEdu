import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

var Notifications = new Mongo.Collection('notifications');

Notifications.schema = new SimpleSchema({
  recipient: { type: String },
  content: { type: String },
  created: { type: String },
  read: { type: Boolean },
  notificationType: {
    type: String,
    allowedValues:
      ['user', 'users', 'mail', 'thumbs up', 'trophy', 'attachment'] 
  }
});

export default Notifications;
