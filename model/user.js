const Sequelize =require('sequelize');

const sequelize=require('../database/database');

const Product = sequelize.define('user',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  name:Sequelize.STRING,
  email:{
    type:Sequelize.STRING,
    allowNull:false
  },
  password:{
    type:Sequelize.STRING,
    allowNull:false
  },
  isPremium:Sequelize.BOOLEAN,
  totalcost:Sequelize.INTEGER
});

module.exports=Product;