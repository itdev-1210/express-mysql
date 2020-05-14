'user strict';

require('dotenv').config();
var async = require('async');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var session = require('express-session');

const constants = require('../config/const');
const userModel = require('../models/userModel');

exports.signup = function (req, res) {
    if (!req.body.usertype) {
        req.body.usertype = constants.Admin;
    }
    var user = new userModel(req.body);
    userModel.getUserByEmail(user.email, function (err, result) {
        if (err) {
            console.log("error ocurred", err);
            return res.json({
                success: false,
                msg: err.message,
                code: constants.ErrorCode
            });
        }
        if (result.length > 0) {
            return res.json({
                success: false,
                msg: "Email already exists",
                code: constants.EmailExistError
            });
        }
        userModel.createUser(user, function (err, result) {
            if (err) {
                console.log("error ocurred", err);
                res.json({
                    success: false,
                    msg: err.message,
                    code: constants.ErrorCode
                });
            } else {
                console.log('success', result);
                res.json({
                    success: true,
                    msg: "Sign up success",
                    code: constants.SuccessCode,
                    result: ''
                });
            }
        });
    });
};

exports.signin = function (req, res) {
    console.log("signin", req.body);
    var email = req.body.email;
    var password = req.body.password;
    if (!req.body.usertype) {
        req.body.usertype = constants.Admin;
    }
    userModel.loginUser(email, password, req.body.usertype, function (err, result) {
        if (err) {
            console.log("error ocurred", err);
            return res.json({
                success: false,
                msg: err.message,
                code: constants.ErrorCode
            });
        }
        if (result == constants.TokenError) {
            return res.json({
                success: false,
                msg: "Error occurs while creating token id.",
                code: result
            });
        }
        if (result == constants.AuthError) {
            return res.json({
                success: false,
                msg: "incorrect Auth info.",
                code: result
            });
        }
        if (result == constants.NoEmailError) {
            return res.json({
                success: false,
                msg: "incorrect Auth info.",
                code: constants.AuthError
            });
        }
        req.session.admin = result[0];
        res.json({
            success: true,
            msg: "login sucess",
            result: result[0],
            code: constants.SuccessCode
        });
    });
};

exports.getAllUsers = function (req, res) {
    var usertype = req.body.usertype;
    userModel.getAllUsers(usertype, function (err, result) {
        if (err) {
            return res.json({
                success: false,
                msg: err.message,
                code: constants.ErrorCode,
            });
        }
        res.send({
            success: true,
            msg: "sucess",
            result: result,
            code: constants.SuccessCode
        });
    });
};

exports.getUserByEmail = function (req, res) {
    if (!req.body.usertype) {
        req.body.usertype = constants.Admin;
    }
    userModel.getUserByEmail(req.body.email, function (err, result) {
        if (err) {
            console.log("error ocurred", err);
            return res.json({
                success: false,
                msg: err.message,
                code: constants.ErrorCode
            });
        }
        if (result.length > 0) {
            return res.json({
                success: false,
                msg: "Email already exists",
                code: constants.EmailExistError
            });
        }
        return res.json({
            success: true,
            msg: "Email no exist",
            code: constants.SuccessCode
        });
    });
}

exports.auth = function (req, res, next) {
    console.log("auth", req.body.tokenid);
    var tokenid = req.body.tokenid;
    userModel.getUserByTokenId(tokenid, function (err, result) {
        if (err) {
            return res.json({
                success: false,
                msg: err.message,
                code: constants.ErrorCode,
            });
        }
        if (result == constants.TokenError) {
            return res.json({
                success: false,
                msg: 'Token ID no exist.',
                code: result,
            });
        } else {
            req.user = result;
            next();
        }
    });
}

exports.getUserInfo = function (req, res) {
    return res.json({
        success: true,
        msg: "Suceess",
        code: constants.SuccessCode,
        result: req.user[0]
    });
}

exports.forgotPassword = function (req, res) {
    session.forgotadmin = [];
    session.forgotadmin.email = req.body.email;
    console.log(req.body.email);
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            session.forgotadmin.resetPasswordToken = token;
            session.forgotadmin.resetPasswordToken.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            var smtpTransport = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                }
            });
            var mailOptions = {
                to: req.body.email,
                from: process.env.MAIL_FROM,
                subject: process.env.MAIL_SUBJECT,
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/admin/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                return res.json({
                    success: true,
                    msg: 'Success',
                    code: constants.SuccessCode,
                    result: req.body.email
                });
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) {
            return res.json({
                success: false,
                msg: 'error',
                code: constants.ErrorCode,
                result: req.body.email
            });
        }
    });
};

exports.updatepassword = function (req, res) {
    if (!session.forgotadmin.email) {
        return res.json({
            success: false,
            msg: 'session expired',
            code: constants.SessionExpired,
        });
    } else {
        var email = session.forgotadmin.email;
        var new_password = req.body.password;
        userModel.updatePassword(email, new_password, function (err, result) {
            if (err) {
                return res.json({
                    success: false,
                    msg: err.message,
                    code: constants.ErrorCode,
                });
            }
            res.send({
                success: true,
                msg: "sucess",
                result: result,
                code: constants.SuccessCode
            });
        });
    }
};

exports.test = function (req, res) {
    console.log('sucess', req.user);
    return res.json({
        code: constants.SuccessCode,
        success: true,
        msg: 'Success',
        result: req.user,
    });
};
