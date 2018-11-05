import { Picker } from 'meteor/meteorhacks:picker';
import bodyParser from 'body-parser';
import Schools from '../api/schools.js';
import Profiles from '../api/profiles.js';

// Output the number of schools with community-based partners
var crunchNumbers = function() {
  var num = Schools.find({ partners: { $ne: [] } }).count() || 0;
  return { number_of_schools: num };
}

Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));

/* When a request is made to this server-side route, it will output the string
 * representation of the result output by `crunchNumbers()`. This is for
 * integration with the dashboard. */
Picker.route('/dashboard_data', function(params, request, response) {
  response.end(JSON.stringify(crunchNumbers()));
});
