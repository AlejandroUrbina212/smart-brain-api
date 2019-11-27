const express = require('express');
const bodyParser = require('body-parser')

const app = express();


app.use(bodyParser.json())
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
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req,res)=>{
    res.send(database.users);
})

app.post('/signin', (req, res) => {
   if (req.body.email === database.users[0].email && 
    req.body.password === database.users[0].password){
        res.json('success');
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
app.post('/image', (req, res)=>{
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
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length -1]);
})

// second parameter is a function that runs right after the listen
app.listen(3000,()=>{
    console.log('app is running on port 3000  ');
})
