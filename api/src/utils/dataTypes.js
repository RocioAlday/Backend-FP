const { DataTypes } = require('sequelize');

const StatusType = DataTypes.ENUM('Active', 'Disabled');
const RoleType   = DataTypes.ENUM('Client', 'Admin');
const PriceType  = DataTypes.DECIMAL(8, 2);
const Material = DataTypes.ENUM('PLA', 'PETG', 'ABS', 'FLEX', 'NYLON', 'RESINA STANDAR', 'RESINA ALTA RESISTENCIA', 'RESINA FLEX', 'RESINA BIOCOMPATIBLE', 'OTROS');

module.exports = { StatusType, RoleType, PriceType, Material } ;