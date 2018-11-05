# HoloEdu

## Usage Instructions
This package requires prerequisite installation of Meteor.js. Installation
instructions can be found on
[the official Meteor website]("https://www.meteor.com/install").

Upon successful installation of Meteor.js:
1. Clone this repository into a directory and `cd` into it afterwards.
2. Run `meteor npm i`. This command will install the NPM dependencies necessary for running.
3. In the `settings.json` file, change the value of `private.adminEmail` to an arbitrary email address. Setting 'defaultImage' to a desired valid URL is optional, and its existing value is binary PNG data notated in Base64.
4. Run `meteor -s settings.json`. The settings file is necessary for running as the server fixture and UI code depend on its values. **To avoid leakage of any email address used, DO NOT commit local changes to `settings.json`.**
