import { Meteor } from 'meteor/meteor';
import SiteInvitations from '../imports/api/site_invitations.js';
import Notifications from '../imports/api/notifications.js';
import Profiles from '../imports/api/profiles.js';
import Groups from '../imports/api/groups.js';
import Resources from '../imports/api/resources.js';
import Messages from '../imports/api/messages.js';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  likeResource: function(resource, liker) {
    check(resource, String);
    check(liker, String);

    Resources.update(
      {
        _id: resource
      },
      {
        $push: { likers: liker }
      }
    );

    Notifications.insert({
      recipient: Resources.findOne({ _id: resource }).sharer,
      content: '<p>' + Profiles.findOne({ userId: liker }).name +
        ' liked your resource "' +
        Resources.findOne({ _id: resource }).title + '".</p>',
      notificationType: 'thumbs up',
      read: false,
      createdAt: new Date()
    });
  },
  addResource: function(title, type, url, sharer, description) {
    check(title, String);
    check(type, String);
    check(url, String);
    check(sharer, String);
    check(description, String);

    Resources.insert({
      title: title,
      type: type,
      url: url,
      sharer: sharer,
      createdAt: new Date(),
      likers: []
    });

    Profiles.update({ userId: sharer }, { $inc: { points: 1 } });
    Notifications.insert({
      recipient: sharer,
      content: '<p>You have received one point for sharing "' +
        title + '".</p>',
      notificationType: 'trophy',
      read: false,
      createdAt: new Date()
    });
  },
  addFriend: function(id1, id2) {
    check(id1, String);
    check(id2, String);
    Profiles.update({ userId: id1 }, { $push: { friends: id2 } });
    Profiles.update({ userId: id2 }, { $push: { friends: id1 } });
  },
  createGroup: function(name, id) {
    check(name, String);
    check(id, String);
    Groups.insert({
      name: name,
      creatorUserId: id,
      members: [],
      createdAt: new Date()
    });
  },
  sendMessage: function(sender, thread, content) {
    check(sender, String);
    check(thread, String);
    check(content, String);
    Messages.insert({
      sender: sender,
      thread: thread,
      content: content,
      createdAt: new Date()
    });
  },
  acceptInvite: function(username, name, email, password, invite_id) {
    check(username, String);
    check(name, String);
    check(email, String);
    check(password, String);
    check(invite_id, String);

    var id = Accounts.createUser({
      username: username,
      email: email,
      password: password
    });

    Meteor.users.update({ _id: id }, { $set: { 'emails.0.verified': true } });

    var invitation = SiteInvitations.findOne({
        _id: invite_id
      }), inviter = invitation.inviter;

    Profiles.insert({
      userId: id,
      name: name,
      image: Meteor.settings.defaultImage,
      points: 0,
      subject: '',
      school: '',
      interests: [],
      createdAt: new Date(),
      friends: [inviter]
    });

    var inviter_profile = Profiles.findOne({ userId: inviter });

    Profiles.update({ _id: inviter_profile._id },
      { $push: { friends: id } });

    Notifications.insert({
      recipient: inviter,
      content: '<p>' + name + ' (' + email +
        ') has accepted your invitation.</p>',
      notificationType: 'user',
      read: false,
      createdAt: new Date()
    });

    SiteInvitations.remove({ _id: invite_id });
  },
  insertInvitation: function(inviter_id, invitee_email) {
    check(inviter_id, String);
    check(invitee_email, String);

    SiteInvitations.insert({
      inviter: inviter_id,
      email: invitee_email,
      createdAt: new Date()
    });
  }
});
