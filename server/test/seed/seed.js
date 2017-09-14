const {ObjectID} = require('mongodb');

const {Users} = require ('./../../models/Users');
const {Todos} = require('./../../models/Todos');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
//some users record
const users = [
    {
      _id: userOneId,
      email: 'adydams@example.com',
      password: 'userOnePass',
      tokens: [{
          access: 'auth',
          token: ({ _id: userOneId, access: 'auth'}, 'myTokenSecret').toString()
      }] 
    },{
      _id: userTwoId,
      email:'dami@example.com',
      password:'userTwoPass',
      tokens: [{
          access : 'auth',
          token : jwt.sign({ _id: userTwoId, access:'auth'}, 'myTokenSecret').toString()
        }] 
    }]
//having some todo array records in the db
const todos=[
    {   _id: new ObjectID(),
        text:'first todo',
        _creator:userOneId
    }, 
    {   _id: new ObjectID(),
        text:'second to do',
        completed: true,
        completedAt: 542,
        _creator: userTwoId
    }
]
const populateTodos = (done)=> {
    Todos.remove({}).then(()=>{
    //to display records in array and not empty array
    return Todos.insertMany(todos) ;  
   }).then(()=>done());
};




const populateUsers = (done)=>{
    Users.remove().then(()=>{
        let userOne = new Users(users[0]).save();
        let userTwo = new Users(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(()=>done());
  }
module.exports = {
 todos, populateTodos, users, populateUsers
};

