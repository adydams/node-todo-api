const {Users} =require('./../models/Users');

//creating middlewares
let authenticate = (req, res, next)=>{
    let token = req.header('x-auth');
    Users.findByToken(token).then((User)=>{
         if(!User) {
             return Promise.reject();
        }
            req.User = User;
            req.token = token;
        next();
    }).catch((e)=>{
    res.status(401).send()
})
};
module.exports = { authenticate};