const express = require('express');
const Razorpay = require('razorpay');
const Order=require('../models/orders');
const User=require('../models/user');


exports.purchasePremium=async (req,res)=>{
    try{

        var rzp=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })
        var options = {
            amount: 2000,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
          };

        rzp.orders.create(options,(err,order)=>{
            if(err){
                console.log(err)
                throw new Error(JSON.stringify(err))
            }
            const ord= new Order({orderid:order.id,status:'PENDING'});
            ord.save()
            .then(()=>{
                return res.status(201).json({order,key_id:rzp.key_id})
            })
        })
    }catch(err){
        console.log(err)
        return res.status(202).json("Unsuccefull")
    }
}
exports.updateTransactionStatus=async (req,res)=>{
    try{
        const {payment_id,order_id}=req.body;
        console.log(req.body);
        console.log(payment_id,order_id)
        const promise1= Order.updateOne({orderid:order_id},{paymentid: payment_id ,status:'SUCCESSFUL'})
        const promise2= User.updateOne({_id:req.user._id},{isPremium:true})
        Promise.all([promise1,promise2]).then(()=>{
            return res.status(202).json({sucess:true,message:"Transaction Successfull"})
        }).catch(err=>console.log(err))
            
            

    }catch(err){
        console.log(err)
        return res.status(402).json({sucess:true,message:"Something went Wrong"})
    }
}