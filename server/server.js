const express = require('express');
const bodyParser = require('body-parser');
let mongoose= require('./db/mongoose');
let {ObjectID} = require('mongodb');
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

//routes to fetch Todo by id
app.get('/todos/:id', (req,res)=>{
    let id =req.params.id;
    if (!ObjectID.isValid(id)){
    return res.status(400).send('{Invalid Id }');
         }
         
    Todos.findById(id).then((todo)=>{
        if(!todo){
        return res.status(404).send({});
        }
       res.status(200).send(todo);
    },(e)=>{
        console.log(e)
    })
});    


app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
});

module.exports ={
    app
};