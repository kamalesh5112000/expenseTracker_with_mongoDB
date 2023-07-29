const express= require('express');

const dotenv=require('dotenv');
dotenv.config();
const cors = require('cors');


const path = require('path');
const bodyParser=require('body-parser');
const sequelize=require('./database/database');



const user = require('./model/user');
const expense=require('./model/expense');
const order=require('./model/orders');
const forgotpassword=require('./model/forgotPasswordRequest');
const filesDownloaded=require('./model/filesdownloaded');

const app = express();


const userRoutes=require('./routes/userRoutes');
const expenseRoute=require('./routes/expenseroute');
const purchaseRoute=require('./routes/purchaseroute');
const featureRoute=require('./routes/premiumFeatureroute');
const analysisRoute=require('./routes/analysisroute');



app.use(bodyParser.json({ extended: false }));
app.use(cors());


app.use(userRoutes);
app.use(expenseRoute);
app.use(purchaseRoute);
app.use(featureRoute);
app.use(analysisRoute);

app.use((req,res)=>{
    
    res.sendFile(path.join(__dirname,`view/${req.url}`))
    console.log("Url :",req.url)
})

user.hasMany(expense);
expense.belongsTo(user)

user.hasMany(forgotpassword);
forgotpassword.belongsTo(user)

user.hasMany(order);
order.belongsTo(user)

user.hasMany(filesDownloaded);
filesDownloaded.belongsTo(user);

sequelize.sync().then(result=>{
    //console.log(result);
    app.listen(process.env.PORT || 5000);
}).catch(err=>console.log(err));