let {mongoose} = require('./../db/mongoose');

let Users= mongoose.model('User',{
    email:{
        type: String,
        required: true,
        minlength:1,
        trim: true
    },
    password:{
        type: String,
        required: true,
        minlength:5,
    }
});

module.exports= {
Users
};