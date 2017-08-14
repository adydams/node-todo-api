//const MongoClient = require('mongodb').MongoClient;
//using destructuring to replicate the above
//MongoClient, objectID has been required from mongodb 
const {MongoClient, objectID} = require('mongodb') 

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if(err){
        console.log('unable to connect to mongo database',err);
    }
    console.log('connected to mongo database');


    db.collection('Users').insertOne(
        {
        name: 'Adigun Dami',
        age: 12,
        location: 'Lagos'
    }, (err, result)=>{
        if(err){
            console.log('unable to connect db', err)
        }
        console.log(JSON.stringify(result.ops, undefined, 2))
    });
    db.collection('Users').insertOne({
        name: 'Adigun Emma',
        age: 12,
        location: 'Lagos'
    }, (err, result)=>{
        if(err){
            console.log('unable to connect db', err)
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
        //getting id
        console.log(JSON.stringify(result.ops[0]._id));
        //getting time
        console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
    })

    
db.collection('Todos').insertOne(
    {
    text:'To do something',
    completed:false
    }
    , (err, result)=>{
        if (err){
            console.log('unable to connect',err);
        }
        return console.log(JSON.stringify(result.ops, undefined, 2));
    })
  
db.close()
});