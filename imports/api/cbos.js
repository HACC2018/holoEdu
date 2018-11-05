import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

var CBOs = new Mongo.Collection('cbos');

CBOs.schema = new SimpleSchema({
  name: { type: String }
});

export default CBOs;
