const express = require('express');
const bodyParser = require('body-parser')
var bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'admin',
      database : 'smartbrain'
    }
  });

// bodyParser allows us to format the responses and requests
app.use(bodyParser.json());
// CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
app.use(cors());

app.get('/', (req,res)=>{
    res.json('welcome');
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid){
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
            res.status(400).json('wrong credentials');
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})
app.post('/register', (req, res) => {
    // destructuring
    const {email, password, name} = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction( trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail  => {
            return trx('users')
            .insert({
                email: loginEmail[0],
                joined: new Date(),
                name: name
            })
            .returning('*')
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(error => {
        res.status(400).json('unable to register');
    });
});
app.get('/profile/:id',(req, res)=>{
    const {id} = req.params;
    db.select('*').from('users').where({
        id: id
    }).then(user =>  {
        console.log(user);
        if (user.length){
            res.json(user[0]);    
        } else {
            res.status(400).json('not found');
        }  
    }).catch( err => {
        res.status(400).json('error getting user');
    })
});
app.put('/image', (req, res)=>{
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then( entries => {
        res.json(entries[0]);
    })
    .catch( err => res.status(400).json('unable to get entries'));
});


// second parameter is a function that runs right after the listen
app.listen(3000,()=>{
    console.log('app is running on port 3000');
})
