const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');

const id = '5a652378d881ea0348ec38b5';

if (!ObjectID.isValid(id)) {
    console.log('Invalid ID');
} else {
    Todo.find({
        _id: id
    }).then((todos) => {
        console.log('----------------------------------------');
        console.log(`Todos: ${todos}`);
        console.log('----------------------------------------');
    });
    
    Todo.findOne({
        _id: id
    }).then((todo) => {
        console.log(`Todo: ${todo}`);
        console.log('----------------------------------------');
    });
    
    Todo.findById(id).then((todo) => {
        console.log(`Find By ID: ${todo}`);
        console.log('----------------------------------------');
    }).catch((e) => console.log('wut' + e));
}

// ObjectID method .isValid() is used to check that the structure of an id is the required format for an ObjectID.
// Mongoose casts _id to ObjectID in the background so we don't have to explicitly make that cast in our code.
// The find() method returns all items in the collection matching the search criteria.
// The findOne() method only finds and returns the first result matching the search criteria.
// The findById() method searches for an item in the collection with an _id matching the one passed in. It's basically findOne just simpler.
