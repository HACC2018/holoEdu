import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

var Resources = new Mongo.Collection('schools');

Resources.schema = new SimpleSchema({
  title: { type: String },
  type: {
    type: String,
    allowedValues: ['multimedia', 'document', 'link']
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
  }
});

export default Resources;
