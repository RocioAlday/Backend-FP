const { DataTypes } = require('sequelize');

const StatusType = DataTypes.ENUM('Active', 'Disabled');
const RoleType   = DataTypes.ENUM('Client', 'Admin');


module.exports = { StatusType, RoleType } ;