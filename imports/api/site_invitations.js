import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

var SiteInvitations = new Mongo.Collection('site_invitations');

SiteInvitations.schema = new SimpleSchema({
  email: { type: String },
  inviter: { type: String },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (!this.isSet) return new Date();
      else return this.value;
    }
  }
});

export default SiteInvitations;
