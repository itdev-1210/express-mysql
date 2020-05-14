'user strict';

require('dotenv').config();
const db = require('../lib/database');

var Event = function(event) {
	this.eventid = event.eventid;
	this.log_name = event.log_name;
	this.source = event.source;
	this.level = event.level;
	this.logged = event.logged;
	this.task_category = event.task_category;
  	this.script = '';
	this.created = new Date();
	this.modified = new Date();
};

Event.createEvent = function (event, callback) {
	console.log("createEvent", event);
	db().query('INSERT INTO events SET ?', event, function (err, result) {
    if (err) {
      console.log("error ocurred",err);
      callback(err, null);
    } else {
      console.log('success: ', result);
      callback(null, result);
    }
	});
}

Event.getEvents = function(eventtype, callback) {
	var query = '';
	if (eventtype == 0) { // all
		query = 'SELECT * FROM events';
	}else if(eventtype == 1) { // resolved
		query = "SELECT * FROM events WHERE script != ''"
	}else if(eventtype == 2) { // unresolved
		query = "SELECT * FROM events WHERE script = ''"
	}
	db().query(query, function (err, result) {
    if (err) {
    	console.log("error ocurred",err);
    	callback(err, null);
    } else {
			console.log("success", result);
			callback(null, result);
    }
	});
}

Event.getEventByEventId = function(eventid, callback) {
	db().query('SELECT * FROM events WHERE eventid = ?',[eventid], function (err, result) {
    if (err) {
    	console.log("error ocurred",err);
    	callback(err, null);
    } else {
		console.log("success", result);
		callback(null, result);
		}
	});
}

Event.updateEventScript = function(eventid, script, callback) {
	db().query('UPDATE events SET script = ? WHERE eventid = ?',[script,eventid], function (err, result) {
    if (err) {
    	console.log("error ocurred",err);
    	callback(err, null);
    } else {
			console.log("success", result);
			callback(null, result);
		}
	});
}

module.exports = Event;