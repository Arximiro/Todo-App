const {ObjectID} = require('mongodb');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 734
}, {
    _id: new ObjectID(),
    text: 'Third test todo'
}];

module.exports = todos;
