const express= require('express');

const dotenv=require('dotenv');
dotenv.config();
const cors = require('cors');
const helmet = require('helmet');
const compression=require('compression');
const morgan = require('morgan');
const fs=require('fs');
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

const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flag:'a'})

app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream:accessLogStream}));

app.use(bodyParser.json({ extended: false }));
app.use(cors());


app.use(userRoutes);
app.use(expenseRoute);
app.use(purchaseRoute);
app.use(featureRoute);
app.use(analysisRoute);

app.use((req,res)=>{
    console.log("URL :" ,req.url);
    res.sendFile(path.join(__dirname,`view/${req.url}`))
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