const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=>{
    if(err){
        console.log('unable to connect database',err)
    }
     console.log('not able to connect to database');

// db.collection('Users').deleteMany({name: "Adigun Dami"}) .then((result)=>{
// console.log(result);
// })
db.collection('Todos').findOneAndDelete({
    completed: true
}).then((result)=>{
console.log(result)
})

})