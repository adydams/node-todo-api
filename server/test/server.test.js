const expect = require('expect');
const request = require('supertest');

let {app} = require('./../server');
let {Todos} = require('./../models/Todos'); 
//having some array records in the db
const todos=[
    {text:'first todo'}, 
    {text:'second to do'}
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
            .expect(400)
            .expect((res)=>{
                expect(res.body).toBe("{Invalid Id }")
            }).end(done)
    })
    it('should return empty array for id not found ', (done)=>{
        let id='59976a149685961bd4b87255';
        request(app)
        .get('/todos/:id')
        .expect(400)
        .expect((res)=>{
            expect(res.body).toEqual({})
        }).end(done)
    })
    it ('should return TODO', (done)=>{
        
        request(app)
        .get('/todos/id')
        .expect(200)
        .expect((res)=>{
            expect(res.body.length).toEqual(3)
        }).end(done)
    })
})