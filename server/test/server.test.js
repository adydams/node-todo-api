const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongoDB')

let {app} = require('./../server');
let {Todos} = require('./../models/Todos'); 
//having some array records in the db
const todos=[
    {   _id: new ObjectID(),
        text:'first todo'
    }, 
    {   _id: new ObjectID(),
        text:'second to do',
        completed: true,
        completedAt: 542
}
    ]

//should remove all the db record before running test 
//to make todo length=1 pass @line 31
beforeEach((done)=>{
    Todos.remove({}).then(()=>{
    //to display records in array and not empty array
    return Todos.insertMany(todos) ;  
   }).then(()=>{
    done();
    })
});
describe('POST/todos', ()=>{
    it('should create new todo', (done)=>{
    let text = 'Studying';
        request(app)
            .post('/todos')
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
                //expect(todo[0].text).toBe(text);
                done();
            }).catch((e)=>done(e));
        });
    }),

    it('should not create todo at bad request', (done)=>{
        text= 'Path `text` is required.'
        request(app)
        .post('/todos')
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
         .expect(200)
         .expect((res)=>{
            expect(res.body.todo[0].text).toBe(todos[0].text);
            expect(res.body.todo[1].text).toBe(todos[1].text);
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
            .expect(404)
            .expect((res)=>{
                expect(res.body).toEqual({})
            }).end(done)
    })
    it('should return empty array/404 for id not found ', (done)=>{
        let id='59a3906df42fb702c04b60f2';
        request(app)
        .get('/todos/:id')
        .expect(404)
        .expect((res)=>{
            expect(res.body).toEqual({})
        }).end(done)
    })
    it ('should return error if TODO not found', (done)=>{
        let id= new ObjectID().toHexString();
      request(app)
        .get('/todos/:id')
        .expect(404)
        .end(done)
    })
})

describe('deleting todos', ()=>{
    it('delete todo by id', (done)=>{
    let hexid= todos[1]._id.toHexString();
    request(app)
       .delete('/todos/hexid')
       .expect(200)
       .expect((res)=>{
           expect(res.body.todo._id).toEqual(id)
            }).end((err,res)=>{
           if (err){
           return done(err)
        }
        Todos.fidById(hexid).then((todo)=>{
        expect(todo).toNotExist()
        }).catch((e)=>done(e))
       })
    })

it('should validate id', (done)=>{
     let id= new ObjectID().toHexString();
      request(app)
        .delete('/todos/:id')
        .expect(400)
        .end(done)
    })
   
   it('should return 400 for invalid id', (done)=>{
     let id='59a3906df42fb702c04b60f2';
        request(app)
        .get('/todos/:id')
        .expect(404)
        .expect((res)=>{
            expect(res.body).toEqual({})
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
             }).end(done)
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
            done()
            })
            
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
            done()
            })
   })
})
