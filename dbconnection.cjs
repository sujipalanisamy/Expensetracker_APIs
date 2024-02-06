const {MongoClient}= require('mongodb')//curly braces are used to take the selective items from the package
let dbconnection
function connectToDb(callBack){
    MongoClient.connect('mongodb+srv://suji:suji@cluster0.pk0mfwz.mongodb.net/ExpenseTracker?retryWrites=true&w=majority').then(function(client){
    dbconnection=client.db()
    callBack() 
   }).catch(function(error){     //catch is used to capture the error and that error is passed inside the call back
    callBack(error)
   })
}
function getDb(){ 
    return dbconnection
}
module.exports={connectToDb,getDb}//indha function ah vera pakkam use panna export panrom