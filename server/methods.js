import { Meteor } from 'meteor/meteor';
import SiteInvitations from '../imports/api/site_invitations.js';
import Notifications from '../imports/api/notifications.js';
import Profiles from '../imports/api/profiles.js';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
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
