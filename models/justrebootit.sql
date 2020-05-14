/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : justrebootit

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2019-01-26 15:57:20
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for applications
-- ----------------------------
DROP TABLE IF EXISTS `applications`;
CREATE TABLE `applications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `version` float DEFAULT NULL,
  `description` text DEFAULT NULL,
  `link` varchar(255) DEFAULT '',
  `created` datetime DEFAULT NULL,
  `field1` varchar(255) DEFAULT NULL,
  `field2` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for events
-- ----------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eventid` bigint(20) NOT NULL,
  `log_name` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  `logged` date DEFAULT NULL,
  `task_category` varchar(255) DEFAULT NULL,
  `script` text DEFAULT NULL,
  `created` date DEFAULT NULL,
  `modified` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `eventid` (`eventid`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for subscriptions
-- ----------------------------
DROP TABLE IF EXISTS `subscriptions`;
CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) DEFAULT NULL,
  `useremail` varchar(255) DEFAULT NULL,
  `card_number` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `cvc` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `expired_date` datetime DEFAULT NULL,
  `tokenid` varchar(255) DEFAULT NULL,
  `card_expired_date` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userid` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for transactions
-- ----------------------------
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created` datetime DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `useremail` varchar(255) DEFAULT NULL,
  `card_number` varchar(255) DEFAULT '',
  `cvc` varchar(255) DEFAULT NULL,
  `card_expired_date` varchar(255) DEFAULT '',
  `tokenid` varchar(255) DEFAULT NULL,
  `expired_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for uploadfile
-- ----------------------------
DROP TABLE IF EXISTS `uploadfile`;
CREATE TABLE `uploadfile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `version` varchar(255) DEFAULT '',
  `description` text DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for userevents
-- ----------------------------
DROP TABLE IF EXISTS `userevents`;
CREATE TABLE `userevents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eventid` bigint(20) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `os` varchar(255) DEFAULT NULL,
  `os_build_version` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5594 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `expired` datetime DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `usertype` int(11) NOT NULL,
  `tokenid` varchar(255) DEFAULT NULL,
  `created` datetime NOT NULL,
  `last_access` datetime NOT NULL,
  `update_event` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (null, '48', 'admin', null, 'admin@gmail.com', '202cb962ac59075b964b07152d234b70', '1', '$2a$10$9HYSXeKRk/dOEojIIFjqSe', '2019-01-17 08:28:31', '2019-01-26 15:46:12', null);
