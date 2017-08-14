const {MongoClient, ObjectID} = require('mongodb') 

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if(err){
        console.log('unable to connect to mongo database',err);
    }
    console.log('connected to mongo database');

db.collection('Todos').findOneAndUpdate({
_id: new ObjectID('5990fcf5f5fa07193cb0c3a9')
},{$set:{
    text:'Eat lunch',
    completed: true
}},{
    returnOriginal: false
}).then((result)=>{
console.log(result);
})

db.collection('Users').findOneAndUpdate({name:"Adigun Emma"},{
    $set:{
        name:'Micheal'
    },
    $inc:{
        age: 10
    }
},{
    returnOriginal: false
}).then((result)=>{
console.log(result);
})
});