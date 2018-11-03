import React, { Component } from 'react';

class Icon extends Component {
  render() {
    return (
      <a className={`item ${this.props.active ? 'active' : ''}`}
        onClick={this.props.onClick}>
        <i className={`large ${this.props.iconType} icon`}></i>
      </a>
    );
  }
}

export default class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIconType: 'user'
    };
  }

  handleClick(event) {
    var self = this;

    return function(type) {
      if (event.target.className.indexOf('active') < 0) {
        self.setState({ activeIconType: type });
      }
    }
  }

  render() {
    var handleClick = this.handleClick.bind(this);

    return (
      <nav className="ui three item inverted menu">
        <Icon iconType='user'
          active={this.state.activeIconType === 'user'}
          onClick={(e) => { handleClick(e)('user'); }} />
        <Icon iconType='newspaper'
          active={this.state.activeIconType === 'newspaper'}
          onClick={(e) => { handleClick(e)('newspaper'); }} />
        <Icon iconType='rocketchat'
          active={this.state.activeIconType === 'rocketchat'}
          onClick={(e) => { handleClick(e)('rocketchat'); }} />
      </nav>
    );
  }
}
