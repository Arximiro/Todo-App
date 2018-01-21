const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        console.log('Unable to connect to MongoDB server');
    } else {
        console.log('Connected to MongoDB server');
        const myDb = client.db('TodoApp');

        myDb.collection('Todos').findOneAndUpdate({ _id: ObjectID('5a63f9639855573868136575') }, {
            $set: {
                completed: false
            }
        }, {
                returnOriginal: false
            }).then((result) => {
                console.log(result);
            });


        client.close();
    }
});

// --- Notes ---
// This files demonstrates how data in the db can be updated.
// The first argument to findOneAndUpdate is the filter, next is the updates, next is the options(optional), then a callback(optional).
// Here for options returnOriginal is passed in and set to false, so the updated item is returned. It is set to true by default.
// If no callback function is passed in a promise is returned.

// The entry is selected by _id, then the using the $set operator, the completed property is set to true.
// You can also use the $inc operator, choosing a field and incrementing it. For example $inc: {age: 1} would increment age by 1.
// $inc can also be used to decrement, for example $inc: {age: -1} would decrement age by 1.
