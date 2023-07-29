const { response } = require('express');
const User = require('../model/user');
const ForgotPassword = require('../model/forgotPasswordRequest');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const sequelize=require('../database/database');


const Sib=require('sib-api-v3-sdk');
const { where } = require('sequelize');
require('dotenv').config()
const client = Sib.ApiClient.instance
const apiKey= client.authentications['api-key']
apiKey.apiKey=process.env.EMAIL_API_KEY
function generateAccessToken(id,nam){
    return jwt.sign({ userId:id,name: nam},'secretkey')

}

async function emailValidate(email,password){
    let emailflag=false;
    let passwordflag=false;
    let userobj=false;
    await User.findAll({where: {email}}).then(user=>{
        
        if(user.length>0){
            emailflag=user[0].email
            passwordflag = user[0].password
            userobj=user
            
        }

    })
    return [emailflag,passwordflag,userobj]

}

exports.addUser=async (req,res,next)=>{
    
    const nam = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    
    const [emailflag,passwordflag]=await emailValidate(email,password)
    console.log(emailflag,passwordflag)
    if(emailflag){
        res.status(202).json({message:"Email Already Exists"})
        //res.status(202).json("Email Exists")
    }else{
        const saltrounds=10;
        bcrypt.hash(password,saltrounds,async(err,hash)=>{
            console.log(err)
            await User.create({
                name:nam,
                email:email,
                password:hash
        
            })
            res.status(203).json({message:'User Created Successfully'})

        })

    }
    

    // const saltrounds=10;
    // bcrypt.hash(password,saltrounds,async(err,hash)=>{
    //     console.log(err)
    //     await User.create({
    //         name:nam,
    //         email:email,
    //         password:hash
    
    //     })
    //     res.status(201).json({message:'User Created Successfully'})

    // })

    
    
    // User.create({
    //     name:nam,
    //     email:email,
    //     password:password

    // }).then(result=>{
    //     res.json(result)
    //     console.log('Created Product');
    // }).catch(err=>console.log(err));
}

exports.loginUser=async (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const [emailflag,passwordflag,userobj]=await emailValidate(email,password)
    console.log(emailflag,passwordflag)
    if(emailflag){
        bcrypt.compare(password,passwordflag,(err,response)=>{
            if(!err){
                if(response){
                    res.status(203).json({message:"Successfully Logged In",token:generateAccessToken(userobj[0].id,userobj[0].name)})
                }else{
                    res.status(201).json({message:"Password Incorrect"})
    
                }
            }else{
                console.log(err)
            }

        })
    }else{
        res.status(202).json({message:"Email Doesn't Exists"})

    }

}


exports.getUsers = (req, res, next) => {
    User.findAll()
    .then(users=>{
      res.json(users)
      //res.json({data:'Hello From Kamalesh'})
    }).catch(err=>{
      console.log(err)
    });
};

exports.forgotpassword=async(req,res,next)=>{
    const email = req.body.email;
    console.log(email)
    console.log("Api Key   ",apiKey.apiKey)
    const uid=uuidv4();
    const user=await User.findAll({where: {email}})
    console.log(`http://52.70.68.204:5000/password/forgotpassword/${uuidv4()}`)
    await ForgotPassword.create({ id:uid, isactive:true, userId:user[0].id})
    const tranEmailApi=new Sib.TransactionalEmailsApi()

    const sender={
        email:'kamalesh5112000@pec.edu'
    }

    const receivers=[{
        email:email
        
    }]
    tranEmailApi.sendTransacEmail({
        sender,
        to:receivers,
        subject: 'Forgot Password',
        textContent:`Click the Below link to Reset the Password
        http://52.70.68.204:5000/password/resetpassword/${uid}`
    }).then(result=>{
        res.status(202).json(result)
        console.log(result)
    }).catch(err=>{
        console.log(err)
        res.json(err)
        

    })

}
exports.resetPassword=async(req,res,next)=>{
     const uid=req.params.ID; 
     console.log(uid)
     const userdata=await ForgotPassword.findAll({where:{id:uid}})
     console.log("User ID:",userdata[0].id)
     if(userdata[0].isactive){
        res.status(200).send(
            `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">
                <title>Todo App</title>
                <style>*{
                    margin: 0;
                    padding: 0;
                    font-family: sans-serif;
                    outline: none;
                    
                }
                
                body{
                    display: flex;
                    min-height: 100vh;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(-45deg,rgb(79, 218, 253),white);  
                }
                .box-area {
                    box-shadow: 20px 20px lightblue;
                    border-radius: 5px;
                  }
                #page{
                    align-items: center;
                    text-align: center;
                }</style>
            </head>
            <body>
            
                <!----main container------>
                <div class="container d-flex justify-content-center align-items-center min-vh-100">
            
                    <!----login container------>
            
                    <div class="row border rounded-5 p-3 bg-white shadow box-area">
            
                        <div class="outer align-items-center">
                            <form action="/password/upgradepassword/${uid}"method="get">
                                <div id="page">
                                    <label style=" color: black; font-weight: bold;">Forgot Password</label>
                                    
                                    <div class="element">
                                        <label>Enter New Password</label>
                                        <br>
                                        <input id="password1"name="newpassword1" type="password" required >
                                    </div>
                                    <br/>
                                    
                                    <button>Reset Password</button>
    
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
            </body>
            </html>
            `)
     }else{
        res.status(200).send(
            `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">
                <title>Todo App</title>
                <style>*{
                    margin: 0;
                    padding: 0;
                    font-family: sans-serif;
                    outline: none;
                    
                }
                
                body{
                    display: flex;
                    min-height: 100vh;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(-45deg,rgb(79, 218, 253),white);  
                }
                .box-area {
                    box-shadow: 20px 20px lightblue;
                    border-radius: 5px;
                  }
                #page{
                    align-items: center;
                    text-align: center;
                }</style>
            </head>
            <body>
            
                <!----main container------>
                <div class="container d-flex justify-content-center align-items-center min-vh-100">
            
                    <!----login container------>
            
                    <div class="row border rounded-5 p-3 bg-white shadow box-area">
            
                        <div class="outer align-items-center">
                                <div id="page">
                                    <label style=" color: black; font-weight: bold;">Reset Link has Expired</label>
                                    
                                </div>

                        </div>
                    </div>
                </div>
                
            </body>
            </html>
            `)
     }
     ///password/updatepassword/${userdata[0].userId}
      res.end()
}

exports.upgradePassword=async(req,res,next)=>{
    console.log(req.query.newpassword1);
    const uid=req.params.ID; 
    console.log(uid)
    const saltrounds=10;
    //const user=User.findAll({where:{id:req.params.ID}})
    const userdata=await ForgotPassword.findAll({where:{id:uid}})
        bcrypt.hash(req.query.newpassword1,saltrounds,async(err,hash)=>{
            console.log(err)
            await User.update({
                password:hash
            },{where:{id:userdata[0].userId}})
        })
        await ForgotPassword.update({isactive:false},{where:{id:uid}})
        
            res.status(200).send(`
            <html>
                <script>
                    alert("Password Changed Successfully");
                    
                </script>
            </html>
        `);
    

}