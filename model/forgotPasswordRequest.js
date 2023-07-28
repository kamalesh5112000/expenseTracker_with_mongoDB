const Sequelize =require('sequelize');
const sequelize=require('../database/database');

const forgotpassword = sequelize.define('forgotpassword',{
    id:{
      type:Sequelize.STRING,
      allowNull:false,
      primaryKey:true
    },
    isactive:Sequelize.BOOLEAN
  });
  
  module.exports=forgotpassword;