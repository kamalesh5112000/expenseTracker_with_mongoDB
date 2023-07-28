const Sequelize =require('sequelize');

const sequelize=require('../database/database');

const expense = sequelize.define('expense',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  amount:Sequelize.INTEGER,
  description:{
    type:Sequelize.STRING,
    allowNull:false
  },
  catecgory:{
    type:Sequelize.STRING,
    allowNull:false
  }
});

module.exports=expense;