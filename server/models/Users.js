let {mongoose} = require('./../db/mongoose');
let validator = require('validator');
let jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema= new mongoose.Schema( {
    email:{
        type: String,
        required: true,
        minlength:1,
        trim: true,
        unique: true,
        validate:{
            validator: (value)=>{
             return validator.isEmail(value);
            },
            message:'Invalid email address '
        }
    },
    password:{
        type: String,
        required: true,
        minlength:5,
    },
    tokens:[{
            access:{
                type: String,
                required:true
            },
            token:{
                type: String,
                required: true
            }
        }]
    });
UserSchema.methods.toJSON = function () {
    let user = this;
    let userToObject = user.toObject();
    return _.pick(userToObject, ['_id', 'email']);
    
};


UserSchema.methods.generateAuthToken = function(){
    let user = this;
    let access= 'auth';
    let token= jwt.sign({_id: user._id.toHexString(), access}, 'myTokenSecret').toString();
    user.tokens.push({access, token});
    

    return user.save().then(()=>{
        return token;
    });
};

UserSchema.methods.removeToken  = function(token) { 
     let user = this;
    
    return user.update({
         $pull: {tokens:{token}}
    });
};

UserSchema.statics.findByToken = function(token) {
    let Users = this;
    let decoded; 

    try {
        decoded = jwt.verify(token, 'myTokenSecret');
    } catch (error) {
        return Promise.reject();
    } 
    return Users.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access' : 'auth'
    });
};

//validating credentials
UserSchema.statics.findByCredentials = function(email, password) {
        let user = this;

        return user.findOne({email}).then((user)=>{
            if (!user){
                return Promise.reject()
                }
                return new Promise((resolve, reject)=>{
                 bcrypt.compare(password, user.password, (err, res)=>{
                    if (res){
                        resolve(user)
                    }
                    reject()
            })
        })
    });
};


//pre will make some codes run before an eevent
UserSchema.pre('save', function(next){
    let user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash)=>{
                user.password = hash;
                next();
            });
        });
    } else {
            next();
        }
 
});


let Users= mongoose.model('Users', UserSchema);

module.exports= {Users};