'user strict';

const db = require('../lib/database');

var Application = function(application) {
	this.name = application.name;
	this.version = application.version;
	this.link = application.link;
	this.description = application.description;
	this.created = new Date();
	this.field1 = null;
	this.field2 = null;
};

Application.creatApplication = function (application, callback) {
	console.log("create", application);
	db().query('INSERT INTO applications SET ?', application, function (err, result) {
    if (err) {
      console.log("error ocurred",err);
      callback(err, null);
    } else {
      console.log('The solution is: ', result);
      callback(null, result);
    }
	});
}

Application.getAppllicationByNameVersion = function(name, version, callback) {
	db().query('SELECT * FROM applications WHERE version = ? AND name = ?',[version, name], function (err, result) {
    if (err) {
    	console.log("error ocurred",err);
    	callback(err, null);
    } else {
			console.log("success", result);
			callback(null, result);
    }
	});
}

Application.searchByName = function(name, callback) {
	query='SELECT * FROM applications WHERE name Like "%' +name+ '%"';
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

Application.updateApplication = function(id, application, callback) {
  db().query('UPDATE applications SET ? WHERE id = ?', [application, id], function (err, result) {
    if (err) {
      console.log("error ocurred",err);
      callback(err, null);
    } else {
      console.log("success",result);
      callback(null, 'success');
    }
  });
}

Application.getAllApplication = function(callback) {
	db().query('SELECT * FROM applications', function (err, result) {
    if (err) {
    	console.log("error ocurred",err);
    	callback(err, null);
    } else {
			console.log("success", result);
			callback(null, result);
    }
	});
};

Application.getAppllicationByID = function(id, callback) {
	db().query('SELECT * FROM applications WHERE id = ?',[id], function (err, result) {
    if (err) {
    	console.log("error ocurred",err);
    	callback(err, null);
    } else {
			console.log("success", result);
			callback(null, result);
    }
	});
}

module.exports = Application;