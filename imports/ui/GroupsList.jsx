import React, { Component } from 'react';
import GroupItem from './GroupItem.jsx';

export default class GroupsList extends Component {
  render() {
    return (
      <section className="ui segment container">
        <h2 className="ui header">My Groups</h2>
        <div className="ui items">
          {this.props.groups.map((group) => <GroupItem group={group} />)}
        </div>
      </section>
    );
  }
}
