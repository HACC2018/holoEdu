import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

var Subjects = new Mongo.Collection('subjects');

Subjects.schema = new SimpleSchema({
  name: { type: String }
});

export default Subjects;
