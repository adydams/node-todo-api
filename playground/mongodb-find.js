const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=>{
    if(err){
        console.log('unable to connect database',err)
    }
     console.log('not able to connect to database');
// viewing all in database     
db.collection('Users').find().toArray().then((docs)=>{
        console.log("....Todos...")
        console.log(JSON.stringify(docs , undefined, 2)), (err)=>{
        console.log('unable to connect data',err)
        }
    })
//searching by string name
db.collection('Users').find({name:"Adigun Dami"}).toArray().then((docs)=>{
        console.log("....Todos...")
        console.log(JSON.stringify(docs , undefined, 2)), (err)=>{
        console.log('unable to connect data',err)
        }
    })
//searching using mongodb _id
db.collection('Todos').find({
    // converting mongo _id to object form for a search
    _id: new ObjectID('599118ba3b73c6160cd5f9f5') 
}).toArray().then((docs) =>{
        console.log('---------')
        console.log(JSON.stringify(docs, undefined, 2))
})   
//counting array
db.collection('Users').find({name: 'Adigun Dami'}).count().then((count)=>{
console.log('counts ::', count);
}, (err)=>{
    console.log('unable to count item', err)
})



})