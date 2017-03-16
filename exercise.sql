/*
Navicat MySQL Data Transfer

Source Server         : 我的
Source Server Version : 50713
Source Host           : localhost:3306
Source Database       : nodejs

Target Server Type    : MYSQL
Target Server Version : 50713
File Encoding         : 65001

Date: 2017-03-16 09:27:13
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `exercise`
-- ----------------------------
DROP TABLE IF EXISTS `exercise`;
CREATE TABLE `exercise` (
  `ID` int(30) NOT NULL,
  `NAME` char(50) DEFAULT NULL,
  `AGE` int(10) DEFAULT NULL,
  `GENDER` char(10) DEFAULT NULL,
  `TEL` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of exercise
-- ----------------------------
INSERT INTO `exercise` VALUES ('1', '张三', '23', '男', '13333333333');
INSERT INTO `exercise` VALUES ('2', '李四', '24', '女', '14444444444');
INSERT INTO `exercise` VALUES ('3', '王五', '25', '男', '15555555555');
INSERT INTO `exercise` VALUES ('4', '赵六', '26', '男', '16666666666');
