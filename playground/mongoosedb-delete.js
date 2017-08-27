const {ObjectID}= require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todos} = require('./../server/models/Todos');
const {Users} = require('./../server/models/Users');

//remove only the id
// Todos.findOneAndRemove({id:'59a0c997f5092b19d0b8ba2e'})
// .then((todo)=>{
//     if (!todo){
//      return console.log("Id not found");
//     }
//     console.log(todo)
// },(e)=>{
//     console.log(e);
// });
// //remove all
Todos.remove({})
.then((todo)=>{
    if (!todo){
     return console.log("Id not found");
    }
    console.log(todo)
},(e)=>{
    console.log(e);
});
 
//remove the Id
// Todos.findByIdAndRemove('59a0c997f5092b19d0b8ba2e')
// .then((todo)=>{
//     if (!todo){
//      return console.log("Id not found");
//     }
//     console.log(todo)
// },(e)=>{
//     console.log(e);
// });