import React, { Component } from 'react';

export default class GroupSearch extends Component {
  render() {
    return (
      <section className="ui segment container">
        <h2 className="ui header">New Groups</h2>
        <div className="ui left icon fluid input">
          <input type="text" placeholder="Search..." />
          <i className="search icon"></i>
        </div>
      </section>
    );
  }
}
