const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let mongoose= require('./db/mongoose');
let {ObjectID} = require('mongodb');
let {Todos} = require('./models/Todos');
let {Users} = require('./models/Users');
let {authenticate} = require('./middleware/authenticate')

//creating test database

// let env= process.env.NODE_ENV||'development';
// console.log(env);
// if(env = 'development'){
// process.env.PORT =3000;
// process.env.('mongodb://localhost:27017/TodoApp');
// }else if(env='test' ){
// process.env.PORT =3000;
// mongoose.connect('mongodb://localhost:27017/TodoAppTest');

// }



let app = express();
//middleware
app.use(bodyParser.json());
//post route
app.post('/todos', authenticate, (req, res)=>{
    let newTodo = new Todos({
    text: req.body.text,
    _creator: req.User._id
    }); 

    newTodo.save().then((docs)=>{
        res.send(docs)
        console.log('Submitted');
        }, (err)=>{
        res.status(400).send(err);
    }); 
});

//routes to get all records in db
app.get('/todos',authenticate, (req,res)=> {

Todos.find({
    _creator: req.User._id
}).then((todo)=>{
res.send({todo});
}, (e)=>{
console.log('unable to display database');
});
});

//routes to fetch Todo by id
app.get('/todos/:id', authenticate, (req,res)=>{
    let id =req.params.id;
    if (!ObjectID.isValid(id)){
    return res.status(404).send('invalid Id');
         }
         
    Todos.findOne({
             _id: id,
             _creator: req.User._id 
        }).then((todo)=>{
        if(!todo){
        return res.status(400).send("{no item found}");
        }
       res.status(200).send(todo);
    },(e)=>{
        console.log(e)
    })
});    

app.delete('/todos/:id',authenticate, (req, res)=>{
    let id= req.params.id;
    if(!ObjectID.isValid(id)){
      return res.status(400).send('Invalid id');
         
    }
    Todos.findOneAndRemove({
        _id: id,
        _creator: req.User._id
    }).then((todo)=>{
      if(!todo){
          res.status(404).send('id not found')
      }
       res.status(200).send(todo);
    },(e)=>{
      console.log(e);
    })
});

app.patch('/todos/:id',authenticate,(req,res)=>{
 let id= req.params.id;
 //_pick from lodash accepts objects
 let body = _.pick(req.body, ['text', 'completed']);

 if (!ObjectID.isValid(id) ) {
     return res.status(404).send();
    }
 if (_.isBoolean(body.completed) && body.completed) {
     body.completedAt = new Date().getFullYear().toString();
     } else {
     body.completed = false,
     body.completedAt= null
    }
    Todos.findOneAndUpdate({
        _id: id,
        _creator: req.User.id
    }, {$set:body}, {new:true}).then((todo)=>{
      if(!todo){
        return res.status(404).send();
    }
        return res.status(200).send({todo});
    })
});

app.post('/user', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new Users(body);

  user.save().then(() => {
      return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

//creating private routes
//authenticate as middle ware

app.get('/user/myToken', authenticate, (req, res)=>{

   res.send(req.User);
});

//route for user login
app.post('/user/login', (req, res)=>{
    let body =_.pick(req.body,['email','password']);
    //res.send({body} );
   Users.findByCredentials(body.email, body.password).then((user)=>{
       return user.generateAuthToken().then((token)=>{
           res.header('x-auth', token).send(user);
       })
   }).catch((e) =>{
       res.status(400).send()
   }) 
});

app.delete('/user/myToken/logout', authenticate, (req, res)=>{

    req.User.removeToken(req.token).then(()=>{
        res.status(200).send();
    }, ()=>{
        res.status(400).send();
    })
});


app.listen(port, ()=>{
    console.log('Server is running on port:',port); 
});

module.exports = {
    app
};