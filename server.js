const express = require('express');
const bodyParser = require('body-parser')
var bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();


app.use(bodyParser.json());
app.use(cors());
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'apples',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            has: '',
            email: 'john@gmail.com'
        }
    ]
}

app.get('/', (req,res)=>{
    res.send(database.users);
})

app.post('/signin', (req, res) => {
   if (req.body.email === database.users[0].email && 
    req.body.password === database.users[0].password){
        res.json(database.users[0]);
    } else {
        res.status(400).json('error login in');
    }
})
app.get('/profile/:id',(req, res)=>{
    let found = false;
    const { id } = req.params;
    database.users.forEach(user => {
        if (user.id == id){
            found = true;
            res.json(user);
        }
    })
    if (!found){
        res.status(400).json('not found');
    }
})
app.put('/image', (req, res)=>{
    let found = false;
    const { id } = req.body;
    database.users.forEach(user => {
        if (user.id == id){
            found = true;
            user.entries++
            res.json(user.entries);
        }
    })
    if (!found){
        res.status(400).json('not found');
    }
})
app.post('/register', (req, res) => {
    // destructuring
    const {email, password, name} = req.body;
    // bcrypt.genSalt(10, function(err, salt) {
    //     bcrypt.hash(password, salt, function(err, hash) {
    //         console.log(hash);
    //     });
    // });
    database.users.push({
        id: '125',
        email: email,
        name: name,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length -1]);
})

// second parameter is a function that runs right after the listen
app.listen(3000,()=>{
    console.log('app is running on port 3000  ');
})
