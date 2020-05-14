'user strict';

const db = require('../lib/database');

var Files = function(version, description) {
	this.version = version;
	this.description = description;
	this.path = '/uploads/';
	this.created = new Date();
};

Files.createFile = function (file, callback) {
	console.log("create", file);
	db().query('INSERT INTO uploadfile SET ?', file, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
	});
}

Files.getFileByVersion = function(version, callback) {
	db().query('SELECT * FROM uploadfile WHERE version = ?',[version], function (err, result) {
    if (err) {
    	callback(err, null);
    } else {
			callback(null, result);
    }
	});
}

Files.getLastVersion = function(callback) {
	db().query('SELECT * FROM uploadfile WHERE ID = (SELECT MAX(ID) FROM uploadfile)', function (err, result) {
    if (err) {
    	callback(err, null);
    } else {
		callback(null, result);
    }
	});
}

module.exports = Files;