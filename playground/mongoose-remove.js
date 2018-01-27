const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require("../server/models/user");

Todo.remove({}).then((result) => {
    console.log(result);
});

Todo.findOneAndRemove({ text: "Third test todo" }).then((result) => {
    console.log(result);
});

Todo.findByIdAndRemove("5a67e71ced9d381534ee8d91").then((result) => {
    console.log(result);
});

// --- Notes ---
// remove({}) written like this will delete everything in the database.
// findOneAndRemove({}) can find an expense in the array that matches the criteria and remove it, then it returns the removed expense.
// findByIdAndRemove({}) removes an expense by the ID and returns the removed expense.
