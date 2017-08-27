const {ObjectID}= require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todos} = require('./../server/models/Todos');
const {Users} = require('./../server/models/Users');

var id='59952fd314415c1b4c59297c';
var userId= '599217a8d5b1d4119cf979b0';
// if(!ObjectId.isValid(iD)){
//     console.log('Invalid Id'); 
// }
// //find all Todo that belong this Id
// Todos.find({
//    _id: id
// }).then((todos)=>{
// console.log('Todos',todos);
// });
// //find one Todo that belong this Id
// Todos.findOne({
//  _id: id
// }).then((todo)=>{
// console.log('Todo',todo);
// });

//finds Todo by Id
Todos.findById(id).then((todos)=>{
 if(!todos){
     return console.log('unable to find User')
 }   
console.log('Todos',todos);
});

Users.findById({
    _id: userId
}).then((user)=>{
if(!user){
    return console.log('Unable to find user');
}
console.log(JSON.stringify(user, undefined,2))
}, (e)=>{
    console.log(e);
})
