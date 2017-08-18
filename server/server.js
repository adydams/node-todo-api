const express = require('express');
const bodyParser = require('body-parser');
let mongoose= require('./db/mongoose');
let {Todos} = require('./models/Todos');
let {Users} = require('./models/Users');


let app = express();
//middleware
app.use(bodyParser.json());
//post route
app.post('/todos', (req, res)=>{
    let newTodo = new Todos({
    text: req.body.text
}); 

newTodo.save().then((docs)=>{
res.send(docs)
console.log('Submitted');
}, (err)=>{
res.status(400).send(err);
}); 
});

//routes to get all records in db
app.get('/todos',(req,res)=> {
Todos.find().then((todo)=>{
res.send({todo});
}, (e)=>{
console.log('unable to display database');
});
});

app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
});

module.exports ={
    app
};