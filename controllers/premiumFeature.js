const User = require('../model/user');
const Expense = require('../model/expense');
const sequelize = require('../database/database');

exports.getleaderBoard=async(req,res,next)=>{
    try{
        const leaderboarduser = await User.findAll({
            attributes:['id','name','totalcost'],
            order:[['totalcost','DESC']]
        });
        console.log(leaderboarduser[0].name,leaderboarduser[0].totalcost)
        
        
        res.json({leaderboard:leaderboarduser,userId:req.user.id});

    }catch(err){
        console.log(err)
    }
    
    
    
    
}