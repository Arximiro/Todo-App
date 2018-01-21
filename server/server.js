const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000.');
});


// --- Notes ---
// bodyParser.json returns a function to express.
// app.use registers bodyParser as middleware for express to use.
// app.post does an HTTP POST request to the url.
// A new todo is created, setting the text property to whatever came back from the request.body.text.
// Then that todo is saved, then the returned doc is sent back to the user.
// If the save fails then it returns status code 400 which is bad request.
