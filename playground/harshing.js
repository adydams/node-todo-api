const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

 let data= {
    id: 6
 }
let token = jwt.sign(data, 'myTokenSecret')
console.log('Token',token);
let decoded= jwt.verify(token, 'myTokenSecret')
console.log(decoded);

// let message ='password111';
// let hash = SHA256(message);

// //adding salt to hash
// let data= {
//     id: 6
// }
// let token= {
//     data,
//     hash: SHA256(JSON.stringify(data)+'somesecrets').toString()
// }

// let resultHash =SHA256(JSON.stringify(token.data)+'somesecrets').toString();
// if(resultHash === token.hash){
//     console.log('data not changed');
// }
// else{
//      console.log('data changed');   
// }
// //console.log(message);
// //console.log(hash);


let password = 'beauiful';

bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(password, salt, (err,hash)=>{
        console.log(hash)
      })
});
let hashedPassword = '$2a$10$TfAkZowowlJAXsHimE4MQOC9olxiW1ZzkC97Acj142nWTrw9IV7/u'
bcrypt.compare(password, hashedPassword, (err, res)=>{
console.log(res);
});
