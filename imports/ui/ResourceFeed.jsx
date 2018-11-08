import React, { Component } from 'react';
import Resources from '../api/resources.js';
import Profiles from '../api/profiles.js';
import { moment } from 'meteor/momentjs:moment';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

class ResourceItem extends Component {
  handleClick() {
    if (this.props.resource.sharer !== Meteor.userId()) {
      Meteor.call('likeResource', this.props.resource._id, Meteor.userId());
    }
  }

  render() {
    var handleClick = this.handleClick.bind(this);

    return (
      <div className="ui item">
        <p>{this.props.resource.sharer !== Meteor.userId() ?
          Profiles.findOne({ userId: this.props.resource.sharer }).name :
          'You'}
        {' shared '}
        <a href={this.props.resource.url}>
          {this.props.resource.title}
        </a>{' '}
        {moment.duration(moment(this.props.resource.createdAt)
          .diff(new Date())).humanize() + ' ago.'}
        </p>
        <div>
          <p>{this.props.resource.title}</p>
          <p>{this.props.resource.description}</p>
        </div>
        {' '}
        <div>
          <a>
            <i className="thumbs up icon" onClick={handleClick}></i>
            {this.props.resource.likers.length}
          </a>
        </div>
      </div>
    );
  }
}

class ResourceFeed extends Component {
  handleClick() {
    $('#resource-add-modal').modal('show');
  }

  render() {
    var handleClick = this.handleClick.bind(this);

    return (
      <section className="ui segment container">
        <h2 className="ui header">Resource Feed</h2>
        <div className="ui left icon fluid input">
          <button className="ui icon button blue" onClick={handleClick}>
            <i className="plus icon"></i>
            {' '}Add Resource
          </button>
        </div>
        <div className="ui items">
          {this.props.resources.map((resource) =>
            <ResourceItem resource={resource} />)}
        </div>
      </section>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('allResources');
  Meteor.subscribe('allProfiles');

  return {
    resources: Resources.find({ }).fetch()
  };
})(ResourceFeed);
