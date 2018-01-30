require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

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

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']);

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    })
});

app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.listen(port, () => {
    console.log(`Started on port ${port}.`);
});

module.exports = { app };

// --- Notes ---
// bodyParser.json returns a function to express.
// app.use registers bodyParser as middleware for express to use.
// body-parser parses incoming request bodies in a middleware before your handlers, available under the req.body property.

// app.post does an HTTP POST request to the url.
// A new todo is created, setting the text property to whatever came back from the request.body.text.
// Then that todo is saved, then the returned doc is sent back to the user.
// If the save fails then it returns status code 400 which is bad request.

// app.get does an HTTP GET request to the url.
// Todo.find() returns all data from the collection.
// In the returned promise then call, that data is sent to the user.
// Instead of just sending todos, sending it like ({todos}) wrapping the array in an object allows for more flexibility.
// Down the line you could add other properties to the object that gets sent to the user if desired.

// app.delete sends an HTTP DELETE request to the url.
// Todo.findAndRemoveById() finds a todo by the _id and removes it.
// The id that is used is pulled off req.params.id.

// app.patch sends an HTTP PATCH request to the url.
// Todo.findByIdAndUpdate() takes in an id, and also the updates, and also any options.
// For this one the updates are created up above using lodash like this _.pick(req.body, ['text', 'completed']) Which creates an object with the update properties.
// Next lodash is used again to check that the completed property of the request IS a boolean AND that it is true.
// If so the completedAt date property is added to the object. If not both properties are set their default values and nothing is updated in the DB.
// When Todo.findByIdAndUpdate() is used, the id is passed in, the object with the update properties and an object where a new prop is set to true
// which makes sure that the object returned to the user is the new updated object.