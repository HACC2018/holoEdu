import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Profiles from '../imports/api/profiles.js';
import Schools from '../imports/api/schools.js';
import CBOs from '../imports/api/cbos.js';
import Subjects from '../imports/api/subjects.js'
import '../imports/server';
import './methods.js';

/* Meteor.startup(function() {
  Accounts.onCreateUser((options, user) => {
    var id = Profiles.insert({
      userId: user._id,
      name: options.profile.name,
      image: Meteor.settings.defaultImage,
      points: 0,
      subject: '',
      school: '',
      interests: [],
      createdAt: new Date(),
      friends: []
    });

    return user;
  });
}); */

if (Meteor.users.find().count() === 0) {
  Accounts.createUser({
    username: 'admin',
    email: Meteor.settings.private.adminEmail,
    password: '123456'
  });
}

if (Profiles.find().count() === 0){
  Profiles.insert({
    userId: Meteor.users.findOne({ username: 'admin' })._id,
    name: 'System Administrator',
    image: Meteor.settings.defaultImage,
    points: 0,
    subject: '',
    school: '',
    interests: [],
    createdAt: new Date(),
    friends: []
  });
}
if (Meteor.users.findOne({ username: 'admin' })) {
  Meteor.users.update({ username: 'admin' },
    { $set: { 'emails.0.verified': true } });
}

if (CBOs.find().count() === 0) {
  CBOs.insert({
    name: 'The Real World Chamber of Commerce'
  });
}

if (Schools.find().count() === 0) {
  Schools.insert({
    name: 'School of Hard Knocks',
    location: 'The Real World',
    partners: [CBOs.findOne({})._id]
  });
}

if (Subjects.find().count() < 2) {
  Subjects.insert({ name: 'Mathematics' });
  Subjects.insert({ name: 'Alchemy' });
  Subjects.insert({ name: 'Memeology' });
}
