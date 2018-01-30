const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');




const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'david@example.com',
    password: 'davidpass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'pete@example.com',
    password: 'petepass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
    }]
}];




const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    _creator: userOneId,
    completed: true,
    completedAt: 734
}, {
    _id: new ObjectID(),
    text: 'Third test todo',
    _creator: userTwoId
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
};

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
}

module.exports = {users, populateUsers, todos, populateTodos};

// This file seeds the users and the todos to the test files for testing purposes.
// First a users array is created. userOne is created properly and userTwo is not.
// userOne has the token array with the access and token property, userTwo does not.
// Proise.all takes in an array of promises, and does one run its then call until all the promises passed in have been resolved.