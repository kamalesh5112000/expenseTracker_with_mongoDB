const Expense = require('../model/expense');
const sequelize=require('../database/database');
const UserServices=require('../services/userservices')
const S3Services=require('../services/S3services')
const filesDownloaded=require('../model/filesdownloaded');

exports.showdata=async(req,res)=>{
    const data=await Expense.findAll({
        attributes:[[sequelize.fn("DATE_FORMAT",sequelize.col("createdAt"),"%d-%m-%Y"),"createdAt"],'description','catecgory','amount'],
        where: {userId:req.user.id}
    })
    res.json(data)
}

exports.downloadexpense=async(req,res)=>{
    try{
        const data=await Expense.findAll({
            attributes:[[sequelize.fn("DATE_FORMAT",sequelize.col("createdAt"),"%d-%m-%Y"),"createdAt"],'description','catecgory','amount'],
            where: {userId:req.user.id}
        })
        const stringifieddata=JSON.stringify(data);
        const filename=`Expense${req.user.id}/${new Date()}.csv`;
        const fileURL = await S3Services.uploadToS3(stringifieddata,filename);
        ffname=`${new Date()}.csv`;
        const fres= await filesDownloaded.create({fileName:ffname,fileUrl:fileURL,userId:req.user.id})
        res.status(200).json({fileURL,Success:"Got the File"})
        // const data =await UserServices.getExpenses(req)
        // console.log(data)

    }catch(err){
        res.status(500).json({fileURL:'',Success:false,err:err})
    }
    
    
}

exports.filedownload=async(req,res)=>{
    const data=await filesDownloaded.findAll({
        attributes:[[sequelize.fn("DATE_FORMAT",sequelize.col("createdAt"),"%d-%m-%Y"),"createdAt"],'fileName','fileUrl'],
        where: {userId:req.user.id}
    })
    res.json(data)
}