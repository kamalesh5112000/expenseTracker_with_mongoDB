const Expense = require('../model/expense');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const sequelize=require('../database/database');


exports.getExpense=async (req, res, next) => {
    const page=+req.query.page;
    const pagelimit=req.body.pagelimit;
    console.log("Page Number :",pagelimit)
    let totalexp =await Expense.count({where: {userId:req.user.id}})
    const userdata=req.user.isPremium
    Expense.findAll({where: {userId:req.user.id},
    offset:(page-1)*pagelimit,
    limit:Number(pagelimit)})
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
    const t=await sequelize.transaction();
    const amount = req.body.amount;
    const description = req.body.description;
    const catecgory = req.body.catecgory;
    console.log(amount,description,catecgory);
    console.log(req.user.id)
    try{
        
        let updateduser=await User.findAll({
            where:{id:req.user.id},
            attributes:['totalcost']

        })
        console.log(updateduser[0].totalcost)
        await User.update({
            totalcost:Number(updateduser[0].totalcost)+Number(amount)
        },{
            where:{id:req.user.id},
            transaction:t
        })
        
        const result = await Expense.create({ amount, description, catecgory, userId:req.user.id},{transaction:t});
        await t.commit();
        res.status(200).json(result)
        console.log('Created Product');

    }catch(err){
        await t.rollback();
        console.log(err)
        res.status(202).json({success:false,error:err})
    }
    
  }

  exports.expensedelete=async(req,res,next)=>{
    
    const expid=req.params.ID;
    console.log(expid)
    const t=await sequelize.transaction();
    try{
        const expenseamount=await Expense.findAll({where:{id:expid,userId:req.user.id},attributes:['amount']})
        const expense=await Expense.destroy({where:{id:expid,userId:req.user.id},transaction:t})
        console.log(expenseamount[0].amount)
        let updateduser=await User.findAll({
            where:{id:req.user.id},
            attributes:['totalcost']

        })
        console.log(updateduser[0].totalcost)
        await User.update({
            totalcost:Number(updateduser[0].totalcost)-Number(expenseamount[0].amount)
        },{
            where:{id:req.user.id},
            transaction:t
        })
        await t.commit();
        res.status(200).json(expense)
        console.log('Expense Deleted')

    }catch(err){
        await t.rollback();
        console.log(err)
        res.status(202).json({success:false,error:err})

    }
  }