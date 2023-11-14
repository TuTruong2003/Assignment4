/*Name: ANH TU TRUONG
ID: 300372032
CSIS3380*/

const express = require('express');
const app = express();

// add this to read the queries from url
// const url = require('url')

const records = require('./records');

app.use(express.json());

// Send a GET request to /quotes to READ a list of users
app.get('/getusers', async (req, res)=>{

    // // code to read queries in the url
    // const url_parts = url.parse(req.url, true)
    // const query = url_parts.query;

    // // your query strings are in the query variable now
    // // you can console.log and see them

    // console.log(query.id)
    // console.log(query.option)

    // // the rest of the program is like before
    const users = await records.getUsers();
    res.json(users);
});
// Send a GET request to /quotes/:id to READ(view) 
app.get('/getusers/:id', async (req, res)=>{
    try {
        const user = await records.getUser(req.params.id);
        if(user){
            res.json(user);
        } else {
            res.status(404).json({message: "user not found."});
        }
        
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});

//Send a POST request to /newuser to  CREATE a new user 
app.post('/newuser', async (req,res) =>{
    try {
        if(req.body.email && req.body.username){
            const user = await records.createUser({
                email: req.body.email,
                username: req.body.username
            });
            res.status(201).json(user);
        } else {
            res.status(400).json({message: "Email and username required."});
        }

    } catch(err) {
        res.status(500).json({message: err.message});
    } 
});
//get a random user
app.get('/getrandomuser', async (req, res)=>{
    const user = await records.getRandomUser();
    res.json(user);
});
// Send a PUT request to /quotes/:id to UPDATE (edit) a quote
app.put('/user/:id', async(req,res) => {
    try {
        const user = await records.getUser(req.params.id);
        if(user){ 
            user.email = req.body.email;
            user.username = req.body.username;

            await records.updateUser(user);
            res.status(204).end();
        } else {
            res.status(404).json({message: "User Not Found"});
        }
        
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

// Send a DELETE request to /quotes/:id DELETE a quote 
app.delete("/user/:id", async(req,res, next) => {
    try {
        const user = await records.getUser(req.params.id);
        await records.deleteUser(user);
        res.status(204).end();
    } catch(err){
        next(err);
    }
});


app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    })
});
app.listen(3000, () => console.log('User API listening on port 3000!'));

