const mongodb= require('mongodb');
const mongoClient = mongodb.MongoClient;
let _db;

const mongoConnect=(callback)=>{
    mongoClient.connect('mongodb+srv://kamalesh5112:Kamal2000@cluster0.7yk6gtm.mongodb.net/expense?retryWrites=true&w=majority')
    .then(client=>{
        console.log("Connected")
        _db = client.db()
        callback()
    })
    .catch(err=>{
        console.log(err)
        throw err;
    });
}

const getDb = ()=>{
    if(_db){
        return _db;
    }
    throw 'No database found'
}

exports.mongoConnect=mongoConnect
exports.getDb=getDb


// const Sequelize=require('sequelize');
// const dotenv=require('dotenv');
// dotenv.config();

// console.log("DATABASE NAME:" ,process.env.DB_HOST)
// console.log("DATABASE NAME:" ,process.env.DB_NAME)
// const sequelize=new Sequelize(process.env.DB_NAME,process.env.CONNECTION_NAME,process.env.CONNECTION_PASSWORD,{dialect:'mysql',host:process.env.DB_HOST});
// module.exports=sequelize;