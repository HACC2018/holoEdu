import React, { Component } from 'react';
import Notifications from '../api/notifications.js';
import { moment } from 'meteor/momentjs:moment';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

class NotificationSection extends Component {
  render() {
    return (
      <section className="ui segment container">
        <h2 className="ui header">Notifications</h2>
        {this.props.newNotifications.length > 0 ? [
          <h3 className="ui header">
            Unread ({this.props.newNotifications.length})</h3>,
          this.props.newNotifications.map(
            (notification) =>
              <div className="ui fluid icon" dangerouslySetInnerHTML={{ __html:
              '<i class="' + notification.notificationType + ' icon"></i><p>' +
                notification.content + '&nbsp;(' +
                moment.duration(moment(notification.createdAt)
                  .diff(new Date())).humanize() + ' ago)</p>' }}
              style={{ display: 'flex' }} />)
        ]: null}
      </section>
    );
  }
}

export default withTracker(() => {
  return {
    newNotifications: Notifications.find({
      read: false,
      recipient: Meteor.userId()
    }).fetch()
  };
})(NotificationSection);
