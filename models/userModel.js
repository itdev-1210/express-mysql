'user strict';

require('dotenv').config();
const db = require('../lib/database');
var session = require('express-session');
const constants = require('../config/const');

var crypto = require('crypto');
var Bcrypt = require('bcryptjs');
var User = function (user) {
    this.username = user.username;
    this.fullname = user.fullname;
    this.email = user.email;
    this.password = crypto.createHash('md5').update(user.password).digest('hex');
    this.usertype = user.usertype;
    this.tokenid = '';
    this.created = new Date();
    this.last_access = new Date();
    this.update_event = null;
    this.expired = null;
};

User.createUser = function (user, callback) {
    console.log("signup", user);
    db().query('INSERT INTO users SET ?', user, function (err, result) {
        if (err) {
            console.log("error ocurred", err);
            callback(err, null);
        } else {
            console.log('The solution is: ', result);
            callback(null, result);
        }
    });
};

User.loginUser = function (email, password, usertype, callback) {
    db().query('SELECT * FROM users WHERE email = ? AND usertype = ?', [email, usertype], function (err, result) {
        if (err) {
            console.log("error ocurred", err);
            callback(err, null);
        } else {
            if (result.length > 0) {
                hash = crypto.createHash('md5').update(password).digest('hex');
                if (result[0].password == hash) {
                    Bcrypt.genSalt(10, function (err, salt) {
                        if (err) {
                            console.log("error ocurred", 'Token error');
                            callback(null, constants.TokenError);
                        }
                        console.log("salt", salt);
                        last_access = new Date();
                        db().query('UPDATE users SET tokenid = ?, last_access = ? WHERE email = ?', [salt, last_access, email], function (err, result1) {
                            if (err) {
                                console.log("error ocurred", err);
                                callback(err, null);
                            } else {
                                result[0].tokenid = salt;
                                console.log("success", result);
                                callback(null, result);
                            }
                        });
                    });
                } else {
                    console.log("error ocurred", "Password not correct");
                    callback(null, constants.AuthError);
                }
            } else {
                console.log("error ocurred", "Email no exist");
                callback(null, constants.NoEmailError);
            }
        }
    });
}

User.getUserByTokenId = function (tokenid, callback) {
    console.log('here is okay', tokenid);
    db().query('SELECT * FROM users WHERE tokenid = ?', [tokenid], function (err, result) {
        if (err) {
            console.log("error ocurred", err);
            callback(err, null);
        } else {
            if (result.length > 0) {
                console.log("success", result);
                callback(null, result);
            } else {
                console.log("error ocurred", "Account no exist");
                callback(null, constants.TokenError);
            }
        }
    });
}

User.getAllUsers = function (usertype, callback) {
    db().query('SELECT * FROM users WHERE usertype = ?', [usertype], function (err, result) {
        if (err) {
            console.log("error ocurred", err);
            callback(err, null);
        } else {
            console.log("success", result);
            callback(null, result);
        }
    });
}

User.getUserByEmail = function (email, callback) {
    db().query('SELECT * FROM users WHERE email = ?', [email], function (err, result) {
        if (err) {
            console.log("error ocurred", err);
            callback(err, null);
        } else {
            console.log("success", result);
            callback(null, result);
        }
    });
}

User.updateEventDate = function (email, callback) {
    update_event = new Date();
    db().query('UPDATE users SET update_event = ? WHERE email = ?', [update_event, email], function (err, result) {
        if (err) {
            console.log("error ocurred", err);
            callback(err, null);
        } else {
            console.log("success", result);
            callback(null, 'success');
        }
    });
}

User.changePassword = function (email, oldpassword, newpassword, callback) {
    hash = crypto.createHash('md5').update(oldpassword).digest('hex');
    db().query('SELECT * FROM users WHERE email = ? AND password = ?', [email, hash], function (err, result) {
        if (err) {
            console.log("error ocurred", err);
            callback(err, null);
        } else {
            if (result.length > 0) {
                hash_new = crypto.createHash('md5').update(newpassword).digest('hex');
                db().query('UPDATE users SET password = ? WHERE email = ?', [hash_new, email], function (err, result) {
                    if (err) {
                        console.log("error ocurred", err);
                        callback(err, null);
                    } else {
                        console.log("success", result);
                        callback(null, 'success');
                    }
                });
            } else {
                console.log("error ocurred", "Old Password incorrect");
                callback(null, constants.OldPassIncorrect);
            }
        }
    });
}

User.updatePassword = function (email, newpassword, callback) {
    hash = crypto.createHash('md5').update(newpassword).digest('hex');
    db().query('UPDATE users SET password = ? WHERE email = ?', [hash, email], function (err, result) {
        if (err) {
            console.log("error ocurred", err);
            callback(err, null);
        } else {
            console.log("success", result);
            callback(null, 'success');
        }
    });
}

User.updatePassword = function (email, newpassword, callback) {
    hash = crypto.createHash('md5').update(newpassword).digest('hex');
    db().query('UPDATE users SET password = ? WHERE email = ?', [hash, email], function (err, result) {
        if (err) {
            console.log("error ocurred", err);
            callback(err, null);
        } else {
            console.log("success", result);
            callback(null, 'success');
        }
    });
}

User.updateExpired = function (req, userid, expired, callback) {
    db().query('UPDATE users SET expired = ? WHERE id = ?', [expired, userid], function (err, result) {
        if (err) {
            console.log("error ocurred", err);
            callback(err, null);
        } else {
            console.log("success", result);
            req.session.key.expired = expired;
            callback(null, 'success');
        }
    });
}

module.exports = User;