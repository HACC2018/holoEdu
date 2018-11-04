import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

var Schools = new Mongo.Collection('schools');

Schools.schema = new SimpleSchema({
  name: { type: String },
  location: { type: String }
});

export default Schools;
