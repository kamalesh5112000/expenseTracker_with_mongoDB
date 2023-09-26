const express= require('express');

const dotenv=require('dotenv');
dotenv.config();
const cors = require('cors');

const mongoose= require('mongoose');

const path = require('path');
const bodyParser=require('body-parser');
const sequelize=require('./database/database');

const morgan = require('morgan');
const fs=require('fs');

const user = require('./models/user');
const expense=require('./models/expense');
// const order=require('./models/orders');
// const forgotpassword=require('./models/forgotPasswordRequest');
// const filesDownloaded=require('./models/filesdownloaded');

const app = express();


const userRoutes=require('./routes/userRoutes');
const expenseRoute=require('./routes/expenseroute');
const purchaseRoute=require('./routes/purchaseroute');
const featureRoute=require('./routes/premiumFeatureroute');
// const analysisRoute=require('./routes/analysisroute');
// const forgotpasswordroute=require('./routes/forgotpasswortroute');

const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flag:'a'})
app.use(morgan('combined',{stream:accessLogStream}));
app.use(bodyParser.json({ extended: false }));
app.use(cors());


app.use(userRoutes);
app.use(expenseRoute);
app.use(purchaseRoute);
app.use(featureRoute);
// app.use(analysisRoute);


app.use((req,res)=>{
    
    res.sendFile(path.join(__dirname,`view/${req.url}`))
    console.log("Url :",req.url)
})

// user.hasMany(expense);
// expense.belongsTo(user)

// user.hasMany(forgotpassword);
// forgotpassword.belongsTo(user)

// user.hasMany(order);
// order.belongsTo(user)

// user.hasMany(filesDownloaded);
// filesDownloaded.belongsTo(user);

mongoose.connect('mongodb+srv://kamalesh5112:Kamal2000@cluster0.7yk6gtm.mongodb.net/expense?retryWrites=true&w=majority').then(result=>{
    //console.log(result);
    console.log('Connected')
    app.listen(process.env.PORT || 5000);
}).catch(err=>console.log(err));