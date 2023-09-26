const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../database/database');

exports.getleaderBoard=async(req,res,next)=>{
    try{
        const leaderboarduser = await User.find().select('id name totalcost').sort({totalcost:'desc'});
        console.log(leaderboarduser[0].name,leaderboarduser[0].totalcost)
        console.log(leaderboarduser)
        
        
        res.json({leaderboard:leaderboarduser,userId:req.user.id});

    }catch(err){
        console.log(err)
    }
    
    
    
    
}