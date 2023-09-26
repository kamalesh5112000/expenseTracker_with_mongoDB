const mongoose= require('mongoose');

const Schema= mongoose.Schema;

const userSchema= new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  isPremium:{
    type:Boolean,
    required:true
  },
  totalcost:{
    type:Number,
    required:true
  }

})

module.exports=mongoose.model('User',userSchema);

// const Sequelize =require('sequelize');

// const sequelize=require('../database/database');

// const Product = sequelize.define('user',{
//   id:{
//     type:Sequelize.INTEGER,
//     autoIncrement:true,
//     allowNull:false,
//     primaryKey:true
//   },
//   name:Sequelize.STRING,
//   email:{
//     type:Sequelize.STRING,
//     allowNull:false
//   },
//   password:{
//     type:Sequelize.STRING,
//     allowNull:false
//   },
//   isPremium:Sequelize.BOOLEAN,
//   totalcost:Sequelize.INTEGER
// });

// module.exports=Product;