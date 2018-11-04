import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

var Resources = new Mongo.Collection('schools');

Resources.schema = new SimpleSchema({
  title: { type: String },
  type: { type: String, enum: ['multimedia', 'document', 'link'] }
});

export default Resources;
