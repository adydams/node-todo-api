let {mongoose} = require('./../db/mongoose');
//or use Schema 
// let Schema = mongoose.Schema;
// let TodoSchema = new Schema(
//     {
//    text: {
//     type: String,
//     required: true,
//     minlength: 1,
//     trim: true
//    },
//    completed:{
//     type: Boolean,
//     default: false
//    },
//    completedAt:{
//     type: Number,
//     default: null
//    }
// })
// let TodosModel = mongoose.model('Todo', TodoSchema);
//

let Todos = mongoose.model('Todo',{
   text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
   },
   completed:{
    type: Boolean,
    default: false
   },
   completedAt:{
    type: Number,
    default: null
   },
   _creator:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
   }
});
module.exports = {
    Todos
};