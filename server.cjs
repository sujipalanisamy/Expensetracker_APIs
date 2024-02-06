const express=require('express')
const bodyParser=require('body-parser')
const {ObjectId} = require('mongodb')
const  {connectToDb,getDb}=require('./dbconnection.cjs')//these are xported from dbconnection.cjs and imported here using curly braces{connectiontodb,getdb}
const app = express()
app.use(bodyParser.json())
// app.get('/', function(request, response) {
//     response.json({
//         "status":"welcome"
//     })
// })
let db
connectToDb(function(error){
    if(error){
        console.log('Could not establish connection...')
        console.log(error)
    }else{
        app.listen(8000)
        db=getDb()
        console.log('getting to port 8000')
    }
})
/**
 * Express Tracker
 * Functionalities : adding entry,getting the summaries of previous entries,editing and deleting
 * Input file:Category,amount,date
 * 
 * CRUD: create,read,update and delete
 * 
 * get-entries / get-data - GET
 * add-entry - POST
 * edit -entry - PATCH
 * delete-entry - DELETE
 */
    
app.post('/add-entry',function(request,response){
    db.collection('ExpensesData').insertOne(request.body).then(function(){
        response.status(201).json({
            "status":"Enter added successfully"
        })
    }).catch(function(){
        response.status(500).json({ 
            "status":"Entry not added"
        })
    })

})

app.get('/get-entries', function(request, response) {
    
    const entries = []// Declaring an empty array
    db.collection('ExpensesData')
    .find()//it will be pointing only one and so we are using for loop and storing it in an array
    .forEach(entry => entries.push(entry))
    .then(function() {
        response.status(200).json(entries)
    }).catch(function() {
        response.status(404).json({      // 4 la start aagra status code client side error ah point pannu//5 means server side error
            "status" : "Could not fetch documents"
        })
    })
})
app.delete('/delete-entry', function(request, response) {
    if(ObjectId.isValid(request.query.id)) {//in the 3rd line above the object id is got required from the dbconnection.cjs
        db.collection('ExpensesData').deleteOne({
            _id : new ObjectId(request.query.id)//query.id this is given at the postman app after question mark as a query to select the id
        }).then(function() {
            response.status(200).json({
                "status" : "Entry successfully deleted"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Entry not deleted"
            })
        })
    } else {
        response.status(500).json({
            "status" : "ObjectId not valid"
        })
    }
})
//last request params or patch
app.patch('/update-entry/:id',function(request,response){
   if(ObjectId.isValid(request.params.id)){
    db.collection('ExpensesData').updateOne(
        {_id : new ObjectId(request.params.id)},
        {$set : request.body}
    ).then(function(){
        response.status(200).json({
            "status":"Entry updated successfully"
        })
    }).catch(function(){
        response.status(500).json({
            "status":"Unsuccessful updation of entry"
        })
    })
   }else{
    request.response(500).json({
        "status":"Object Id is not valid"
    })
   }
    
})
