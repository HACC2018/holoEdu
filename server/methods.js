import { Meteor } from 'meteor/meteor';
import SiteInvitations from '../imports/api/site_invitations.js';
import { check } from 'meteor/check';

Meteor.methods({
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
