const Expense = require('../models/expense');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sequelize=require('../database/database');


exports.getExpense=async (req, res, next) => {
    const page=+req.query.page;
    const pagelimit=req.body.pagelimit;
    console.log("Page Number :",pagelimit)
    let totalexp= await Expense.find({userId:req.user.id}).count();
    console.log('totalexpense',totalexp)
    const userdata=req.user.isPremium
    Expense.find({userId:req.user.id}).limit(Number(pagelimit)).skip((page-1)*pagelimit).sort({ _id: -1 })
    // offset:(page-1)*pagelimit,
    // limit:Number(pagelimit)})
    .then(data=>{
        
      let pag={
        datalength:totalexp,
        currpage:page,
        hasnextpage:page*pagelimit<totalexp,
        nextpage:page+1,
        hasprevpage:page>1,
        prevpage:page-1
      }  
      res.json({data,userdata,pag})

    }).catch(err=>{
      console.log(err)
    });
  };

  exports.addExpense=async (req,res,next)=>{
    
    const amount = req.body.amount;
    const description = req.body.description;
    const catecgory = req.body.catecgory;
    console.log(amount,description,catecgory);
    console.log(req.user.id)
    try{

      await User.updateOne({_id:req.user.id},{totalcost:Number(req.user.totalcost)+Number(amount)})
        
        const expense = new Expense({ amount:amount, description:description, catecgory:catecgory, userId:req.user.id});
        const result = await expense.save();
        res.status(200).json(result)
        console.log('Created Product');

    }catch(err){
        console.log(err)
        res.status(202).json({success:false,error:err})
    }
    
  }

  exports.expensedelete=async(req,res,next)=>{
    
    const expid=req.params.ID;
    console.log(expid)
    try{
        
        const expenseamount=await Expense.find({_id:expid}).select('amount')
        console.log("Expense Amount",expenseamount[0].amount,req.user.totalcost)
        await User.updateOne({_id:req.user.id},{totalcost:Number(req.user.totalcost)-Number(expenseamount[0].amount)})
        const expense = await Expense.findByIdAndDelete(expid)
        res.status(200).json(expense)
        console.log('Expense Deleted')

    }catch(err){
        console.log(err)
        res.status(202).json({success:false,error:err})

    }
  }