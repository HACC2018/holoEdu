import React, { Component } from 'react';
import Notifications from '../api/notifications.js';
import { moment } from 'meteor/momentjs:moment';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

class NotificationBox extends Component {
  handleClick() {
    Notifications.update({ _id: this.props.notification._id }, { $set: {
      read: true
    } });
  }

  render() {
    var handleClick = this.handleClick.bind(this);

    return (
      <div className="ui fluid icon" dangerouslySetInnerHTML={{ __html:
        '<i class="' + this.props.notification.notificationType +
          ' icon"></i><p>' + this.props.notification.content + '&nbsp;(' +
          moment.duration(moment(this.props.notification.createdAt)
            .diff(new Date())).humanize() + ' ago)</p>' }}
      style={{ display: 'flex' }} onClick={handleClick} />
    );
  }
}

class NotificationSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    }
  }

  handleCollapseToggle() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    var handleCollapseToggle = this.handleCollapseToggle.bind(this);

    if (this.props.newNotifications.length > 0) {
      return (
        <section className="ui segment container">
          <h2 className="ui header" style={{ marginBottom: 0 }}>
            Notifications</h2>
          <div style={{ float: 'right', position: 'relative', top: '-25px' }}>
            <p>
              <a className="ui icon" onClick={handleCollapseToggle}
                style={{ fontSize: '24px' }}>
                <i className='expand icon'></i>
                {this.state.collapsed ? 'Expand': 'Collapse'}
              </a>
            </p>
          </div>
          {!this.state.collapsed && this.props.newNotifications.length > 0 ?
            [<h3 className="ui header">
              Unread ({this.props.newNotifications.length})</h3>,
            this.props.newNotifications.map(
              (notification) => <NotificationBox notification={notification} />)
            ]: null}
        </section>
      );
    }
    else return null;
  }
}

export default withTracker(() => {
  Meteor.subscribe('notificationsDefault', Meteor.userId());

  return {
    newNotifications: Notifications.find({
      read: false,
      recipient: Meteor.userId()
    }, { $sort: { createdAt: -1 } }).fetch()
  };
})(NotificationSection);
