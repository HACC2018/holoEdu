import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Profiles from '../api/profiles.js';
import { Meteor } from 'meteor/meteor';
import Schools from '../api/schools.js';
import Subjects from '../api/subjects.js';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      name: this.props.profile ? this.props.profile.name : '',
      grade_level: this.props.profile ? this.props.profile.grade_level : '',
      subject: this.props.profile ? this.props.profile.subject : '',
      school: this.props.profile ? this.props.profile.school : '',
      description: this.props.profile ?
        this.props.profile.description : ''
    };
  }

  logout() {
    Meteor.logout();
  }

  handleClick(event) {
    this.logout();
  }

  handleEditClick(event) {
    this.setState({ editMode: true });
  }

  handleSaveClick(event) {
    this.setState({ editMode: false }, function() {
      Profiles.update({ _id: this.props.profile._id }, { $set:
        {
          name: this.state.name,
          grade_level: this.state.grade_level,
          subject: this.state.subject,
          school: this.state.school,
          description: this.state.description
        }
      });
    });
  }

  handleCancelClick(event) {
    this.setState({ editMode: false,
      name: this.props.profile.name,
      grade_level: this.props.profile.grade_level,
      subject: this.props.profile.subject,
      school: this.props.profile.school,
      description: this.props.profile.description
    });
  }

  handleSelectChange(event) {
    var self = this;
    return function(key) {
      var newState = {};
      newState[key] = event.target.value;
      self.setState(newState);
    };
  }

  render() {
    var handleClick = this.handleClick.bind(this),
      handleEditClick = this.handleEditClick.bind(this),
      handleCancelClick = this.handleCancelClick.bind(this),
      handleSaveClick = this.handleSaveClick.bind(this),
      handleSelectChange =this.handleSelectChange.bind(this);

    if (this.props.profile) {
      return (
        <header className="ui segment container">
          <div className="ui grid">
            <div className="four wide column">
              <img className="ui medium circular image"
                src={this.props.profile.image} />
            </div>
            <div className="ten wide column">
              {this.state.editMode ?
                <input className="ui fluid input" style={{
                  fontSize: '2rem', fontFamily:
                    'Lato, "Helvetica Neue",Arial,Helvetica,sans-serif',
                  fontWeight: 700
                }} type="text" value={this.state.name}
                onChange={(e) => { handleSelectChange(e)('name'); }} /> :
                <h1 className="ui header">{this.props.profile.name}</h1>}
              <p>
                {this.state.editMode ? (
                  <select onChange={(e) => { handleSelectChange(e)('school'); }}
                    value={this.state.school !== '' ?
                      this.state.school : 'none'}>
                    <option value='none'>No school chosen.</option>
                    {Schools.find().fetch().map((school) => (
                      <option value={school._id}>{school.name}</option>
                    ))}
                  </select>
                ) : (!!this.props.profile.school ?
                  <a href="#" className="ui circular label">
                    {Schools.findOne({
                      _id: this.props.profile.school
                    }).name}</a> : null)}
                {this.state.editMode ? (
                  <select onChange=
                    {(e) => { handleSelectChange(e)('subject'); }}
                  value={this.state.subject !== '' ?
                    this.state.subject : 'none'}>
                    <option value='none'>No subject chosen.</option>
                    {Subjects.find().fetch().map((subject) => (
                      <option value={subject._id}>{subject.name}</option>
                    ))}
                  </select>) : (!!this.props.profile.subject ?
                  <a href="#" className="ui circular label">
                    {Subjects.findOne({ _id: this.props.profile.subject }).name}
                  </a> : null)}
                {this.state.editMode ? (
                  <select onChange={(e) => {
                    handleSelectChange(e)('grade_level');
                  }} value={this.state.grade_level !== '' ?
                    this.state.grade_level : 'none'}>
                    <option value='none'>No grade level chosen.</option>
                    {['Elementary', 'Kindergarten', '1st Grade',
                      '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
                      'Middle/Intermediate', '6th Grade', '7th Grade',
                      '8th Grade', 'High', '9th Grade',  '10th Grade',
                      '11th Grade', '12th Grade'
                    ].map((gradeLevel) =>
                      <option value={gradeLevel}>{gradeLevel}</option>)}
                  </select>
                ) : (!!this.props.profile.grade_level ?
                  <a href="#" className="ui circular label">
                    {this.props.profile.grade_level}
                  </a> : null)}
              </p>
              {this.state.editMode ? (
                <textarea onChange={(e) => {
                  handleSelectChange(e)('description'); }}
                value={this.state.description ?
                  this.state.description : '' } />) :
                ((!!this.props.profile.description &&
                  this.props.profile.description.length > 0) ?
                  <div dangerouslySetInnerHTML=
                    {{ __html: this.props.profile.description }} /> : null)}
            </div>
            <div className="two wide column">
              { this.state.editMode ?
                [<p>
                  <a className="ui icon" href="#" onClick={handleSaveClick}>
                    <i className="save icon"></i>
                    Save Profile
                  </a>
                </p>, <p>
                  <a className="ui icon" href="#" onClick={handleCancelClick}>
                    <i className="cancel icon"></i>
                    Cancel
                  </a>
                </p>]: (<p>
                  <a className="ui icon" href="#" onClick={handleEditClick}>
                    <i className="edit icon"></i>
                    Edit Profile
                  </a>
                </p>) }
              <p>
                <a className="ui icon" href="#" onClick={handleClick}>
                  <i className="logout icon"></i>
                  Log Out
                </a>
              </p>
            </div>
          </div>
        </header>
      );
    }
    else return null;
  }
}

export default withTracker(() => {
  Meteor.subscribe('allSchools');
  Meteor.subscribe('allSubjects');
  Meteor.subscribe('singleProfile', Meteor.userId());

  return {
    profile: Profiles.findOne({ userId: Meteor.userId() })
  };
})(Header);
