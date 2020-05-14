'user strict';

require('dotenv').config();

var fs = require('fs');
var path = require('path');
var mime = require('mime');
var async = require('async');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var session = require('express-session');

const constants = require('../../config/const');
const userModel = require('../../models/userModel');
const fileModel = require('../../models/fileModel');

exports.signup = function(req,res) {
  if (!req.body.usertype) {
    req.body.usertype = constants.Client;
  }
  var user = new userModel(req.body); 
  userModel.getUserByEmail(user.email, function(err, result){
    if (err) {
      console.log("error ocurred",err);
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
    } else {
      userModel.createUser(user, function(err, result) {
        if (err) {
          console.log("error ocurred",err);
          res.json({
            success: false,
            msg: err.message,
            code: constants.ErrorCode
          })
        } else {
          console.log('success', result);
          res.json({
            success: true,
            msg: "Sign up success",
            code: constants.SuccessCode,
            result:''
          });
        }
      });
    }
  });
}

exports.signin = function(req,res){
    console.log("signin", req.body )
    var email= req.body.email;
    var password = req.body.password;
    if (!req.body.usertype) {
      req.body.usertype = constants.Client;
    }
    userModel.loginUser(email, password, req.body.usertype, function(err, result){
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
    req.session.key = result[0];
    res.json({
      success: true,
      msg: "login sucess",
      result: result[0],
      code: constants.SuccessCode
    });
  });
}

exports.changePassword = function(req, res) {
  if(!req.session.key) {
    return res.json({
      success: false,
      msg: 'session expired',
      code: constants.SessionExpired,
    });
  } else {
    var usertype = req.session.key.usertype;
    var email = req.session.key.email;
    var old_password = req.body.old_password;
    var new_password = req.body.new_password;
    userModel.changePassword(email, old_password, new_password, function(err, result) {
      if (err) {
        return res.json({
          success: false,
          msg: err.message,
          code: constants.ErrorCode,
        });
      }
      if (result == constants.OldPassIncorrect) {
        return res.json({
          success: false,
          msg: "Old password incorrect.",
          code: constants.OldPassIncorrect
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
}

exports.updatepassword = function(req, res) {
  if(!session.forgotuser.email) {
    return res.json({
      success: false,
      msg: 'session expired',
      code: constants.SessionExpired,
    });
  } else {
    var email = session.forgotuser.email;
    var new_password = req.body.password;
    userModel.updatePassword(email, new_password, function(err, result) {
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
}

exports.getUserByEmail = function(req,res) {
  if (!req.body.usertype) {
    req.body.usertype = constants.Client;
  }
  userModel.getUserByEmail(req.body.email, function(err, result){
    if (err) {
      console.log("error ocurred",err);
      return res.json({
        success: false,
        msg: err.message,
        code: constants.ErrorCode
      })
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

exports.download = function(req, res) {
  fileModel.getLastVersion(function(err, result){
    if (err) {
      console.log("error ocurred",err);
      return res.json({
        success: false,
        msg: err.message,
        code: constants.ErrorCode
      })
    } else {
      if(result.length > 0){
        var version = result[0].version;
        var file = path.join(__dirname, '../../public/uploads/'+version+'_justrebootit.rar')
        if(fs.existsSync(file)){
        var filename = path.basename(file);
        var mimetype = mime.lookup(file);
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);
        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
      }
      } else {
        return res.json({
          success: false,
          msg: err.message,
          code: constants.ErrorCode
        });
      }
    }
    console.log('success', result);
});
  
}

exports.forgotPassword = function(req, res) {
  session.forgotuser = [];
  session.forgotuser.email = req.body.email;
  console.log(req.body.email);
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      session.forgotuser.resetPasswordToken = token;
      session.forgotuser.resetPasswordToken.resetPasswordExpires = Date.now() + 3600000; // 1 hour
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
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        return res.json({
          success: true,
          msg: 'Success',
          code: constants.SuccessCode,
          result: req.body.email
        });
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) {
      return res.json({
        success: false,
        msg: 'error',
        code: constants.ErrorCode,
        result: req.body.email
      });
    } ;
  });
}
