require('dotenv').config();
const { Sequelize, Op }= require('sequelize');
const fs= require('fs');
const path= require('path');
const {
    DB_USER, DB_PASSWORD, DB_HOST, DATABASE_URL
} = process.env;
const bcrypt= require('bcrypt');

//Acá iria la instancia de sequelize con los datos que tengo en env

// const sequelize = new Sequelize(`${DATABASE_URL}`, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// });

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@localhost:${DB_HOST}/fullprism`, {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  });  


const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

const { User, Cart, Order, Model, OrderDetail, OrderConfirmed }= sequelize.models;

User.prototype.passwordMatched= async(password, passwordEntered)=>{
  const result= await bcrypt.compare(passwordEntered, password);
  return result; //if matched, it returns true, otherwise it will return false
};

// Aca vendrian las relaciones
Cart.belongsTo(User, {foreignKey: 'userId' });
User.hasOne(Cart);
Order.belongsTo(User, { foreignKey: 'userId' });
Order.belongsTo(Cart, { foreignKey: 'cartId' });
User.hasMany(Order, { foreignKey: 'userId' });
Cart.hasMany(Order, { foreignKey: 'cartId' }); 
Model.belongsToMany(Order, { through:  OrderDetail });
Order.belongsToMany(Model, { through: OrderDetail });
User.hasMany(OrderConfirmed, { foreignKey: 'userId' });

// Model.belongsToMany(OrderConfirmed, { through: DetailOrderConfirmed });
// OrderConfirmed.belongsToMany(Model, { through: DetailOrderConfirmed });

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, 
  Op    // para importart la conexión { conn } = require('./db.js');
};