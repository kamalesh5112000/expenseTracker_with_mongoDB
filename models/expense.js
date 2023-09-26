const mongoose= require('mongoose');

const Schema= mongoose.Schema;

const expenseSchema= new Schema({
  amount: {
    type:Number,
    required: true
  },
  description:{
    type:String,
    required:true
  },
  catecgory:{
    type:String,
    required:true
  },
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
})


module.exports=mongoose.model('Expense',expenseSchema);

// const Sequelize =require('sequelize');

// const sequelize=require('../database/database');

// const expense = sequelize.define('expense',{
//   id:{
//     type:Sequelize.INTEGER,
//     autoIncrement:true,
//     allowNull:false,
//     primaryKey:true
//   },
//   amount:Sequelize.INTEGER,
//   description:{
//     type:Sequelize.STRING,
//     allowNull:false
//   },
//   catecgory:{
//     type:Sequelize.STRING,
//     allowNull:false
//   }
// });

// module.exports=expense;