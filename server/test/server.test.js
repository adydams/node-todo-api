const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongoDB')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
let {app} = require('./../server');
let {Todos} = require('./../models/Todos'); 
let {Users} = require('./../models/Users');


//should remove all the db record before running test 
//to make todo length=1 pass @line 31
beforeEach(populateTodos);
beforeEach(populateUsers);


describe('POST/todos', ()=>{
    it('should create new todo', (done)=>{
    let text = 'Studying';
        request(app)
            .post('/todos')
            .set('x-auth', users[1].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toInclude(text);
            })
        .end((err, result)=>{
            if (err){
                return done(err)
            }
            //otherwise verifying database for the item
            Todos.find({text}).then((todo)=>{
                //the first item in db otherwise 1 will change
                expect(todo.length).toBe(1);
                expect(todo[0].text).toBe(text);
                done();
            }).catch((e)=>done(e));
        });
    }),

    it('should not create todo at bad request', (done)=>{
        text= 'Path `text` is required.'
        request(app)
        .post('/todos')
        .set('x-auth',users[1].tokens[0].token)
        .send({})
        .expect(400)
        .expect((res)=>{
            expect(res.body.errors.text.message).toBe(text)
        }).end((err,result)=>{
            if(err){
                return done(err)
            }
            Todos.find().then((todo)=>{
                expect(todo.length).toBe(2);
                done();
            }).catch((e)=>done(e));
        });
    }),

    it ('should return todos const array before each test',(done)=>{
        request(app)
         .get('/todos')
         .set('x-auth',users[1].tokens[0].token)
         .expect(200)
         .expect((res)=>{
             //user [1] posted second todo checking the database
            expect(res.body.todo[0].text).toBe(todos[1].text);
            })
        .end((err, result)=>{
            if(err){
                return done(err)
            }
            Todos.find().then((todo)=>{
              expect(todo.length).toBe(2);
              done();  
            }).catch((e)=>done(e));
        });
    })
    it('should validate id',(done)=>{
        let id ='59976a149685961bd4b87255lll';
       
        request(app)
            .get('/todo/:id')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .expect((res)=>{
                expect(res.body).toEqual({})
            }).end(done)
    })
    it('should return empty array/404 for id not found ', (done)=>{
        let id='59a3906df42fb702c04b60f2';
        request(app)
        .get('/todos/:id')
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .expect((res)=>{
            expect(res.body).toEqual({})
        }).end(done)
    })
    it ('should return error if TODO not found', (done)=>{
        let id= new ObjectID().toHexString();
      request(app)
        .get('/todos/:id')
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done)
    })
})

describe('deleting todos', ()=>{
    
    it('should validate id', (done)=>{
        let id= todos[0]._id.toHexString();
        request(app)
            .delete('/todos/:id')
            .expect(400)
        .end(done)
    })
   
   it('should return 400 for invalid id', (done)=>{

    let id= todos[0]._id +'1';
    request(app)
        .get('/todos/:id')
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .expect((res)=>{
            expect(res.body).toEqual({})
        }).end(done)
    
    })
    it('delete todo by id', (done)=>{
    let id= todos[1]._id.toHexString();
    request(app)
       .delete('/todos/:id')
       .expect((res)=>{
           expect(res.body._id).toNotExist()
            }).end((err,res)=>{
                if (err){
                 return done(err)
                }
            Todos.findById(id).then((todo)=>{
                expect(200)
                expect(todo).toNotExist()
            }).catch((e)=>done(e))
       }).end(done)
    })
})
describe('patch routes', ()=>{
    it('returns 400 for invalid id',(done)=>{
        let id='59a3aa0636c6fc24204a643d' 
        request(app)
            .patch('/todos/:id')
            .expect(404)
            .expect((res)=>{
               expect(res.body).toEqual({})           
            })
        .end(done)
   })
   it('should update existing todos when completed',(done)=>{
    let id= todos[0]._id.toHexString();
    let text = 'testing routes';
        request(app)
            .patch('/todos/:id')
            .send({
              completed:true, 
              text
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text)
                expect(res.body.todo.completed).toBe(true)
                expect(res.body.todo.completedAt).toBeA(number)
             })
            done();
     })   
        

   it('should update when completed is false ', (done)=>{
    let id= todos[0]._id.toHexString();
    let text = 'testing routes!!!';
    request(app)
        .patch('/todos/:id')
        .send({
              completed:false, 
              text
         })
        .expect(200)
        .expect((res)=>{
                expect(res.body.todo.text).toBe(text)
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toNotExist()
        })
        done();
    })
})

describe('test for users', ()=>{
    it('should test for authentication',(done)=>{
        request(app)
            .get('/user/myToken')
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toEqual(users[1]._id)
                expect(res.body.email).toBe(users[1].email)
            }).end(done)
    })

    it('should return 401 without authentication', (done)=>{
        request(app)
            .get('/user/myToken')
            .expect(401)
            .expect((res)=>{
                 expect(res.body).toEqual({})
            }).end(done)
    })

    it ('should return 200 when user is created', (done)=>{
        let email = 'grace@gmail.com'
        let password = 'gracepass'
        request(app) 
            .post('/user')  
            .send({email, password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
                expect(res.body.email).toEqual(email);
                expect(res.body.password).toNotEqual(password);
            })
            .end((err)=>{
                if (err){
                return done(err);
            }
            Users.find({email}).then((user)=>{
                expect(user).toExist();
                done()
            }).catch((e)=>done(e))
        })
    })

    it('should return error for invalid email', (done)=>{
        let email = 'dami'
        let password ='invalidEmailTest'
        request(app)
            .post('/user')
            .send({email, password})
            .expect(400)
            .expect((res)=>{
                expect(res.body.email).toNotExist();
            })
            .end(done)
    })
    it ('should not create user if email exist in DataBase',(done)=>{
        //let email = 'dami@example.com'
        let email = users[0].email
        request(app)
            .post('/user')
            .send({email})
            .expect(400)
            .expect((res)=>{
                expect(res.body.errors).toExist();
            })
            .end((err)=>{
                if (err){
                return done(err)
                }
                Users.find({email}).then((user)=>{
                    expect(user).toExist()
                    done()
                })
            })
    })
})

describe('user/login tests', ()=>{
    it('should return 200 for user in database and token should exist', (done)=>{
        request(app)
            .post('/user/login')
            .send({email: users[0].email, password: users[0].password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toInclude(users[0]._id)
            })
            .end((err, res)=>{
                if (err) {
                  return done(err)
                }
                Users.findById({_id: users[1]._id}).then((user)=>{
                    expect(user.tokens[0]).toInclude({
                        //access: 'auth',
                       token : res.headers['x-auth']
                })
                    done()
                }).catch((e)=>done(e))
            })
    })
    it('should return 400 for invalid log email ', (done)=>{
        let email = 'andrew@example.com'
        let password ='pass123'
        request(app)
            .post('/user/login')
            .send({email, password})
            .expect(400)
            .expect((res)=>{
                expect(res.body).toEqual({})
            })
            .end(done)
    })

    it('should return 400 for invalid password', (done)=>{
        //invalid password
        let password =users[0].password +'1'
        request(app)
            .post('/user/login')
            .send({email: users[0].email, password})
            .expect(400)
            .expect((res)=>{
                expect(res.body).toEqual({})
            })
            .end((err,res)=>{
                if (err){
                    done()
                }
                Users.findById({_id: users[0]._id}).then((user)=>{
                    expect(user.tokens[0]).toNotExist()
               })  
               done()
            })
    })
})

describe('testing deleting  token for logout', ()=>{
    it('should remove token and return 200', (done)=>{

        request(app)
            .delete('/user/myToken/logout')
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body).toEqual({})
                })
            .end((err, res)=>{
                if (err){
                 return done(err);
                }
               Users.findById({
                   _id: users[0]._id
               }).then((user)=>{
                   expect(user.tokens.length).toBe(1);
                   expect(user.tokens.token).toNotExist()
                   done();
                 }).catch((e)=>done(e));
            })
    });
})