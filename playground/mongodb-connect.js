const {MongoClient, ObjectID} = require('mongodb');


const obj = new ObjectID();
console.log(`Random ID: ${obj}`);;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        console.log('Unable to connect to MongoDB server');
    } else {
        console.log('Connected to MongoDB server');
        const myDb = client.db('TodoApp');

        myDb.collection('Todos').insertOne({
            text: 'Buy Groceries',
            completed: false
        }, (err, result) => {
            if (err) {
                return console.log('Unable to insert todo', err);
            }

            console.log(JSON.stringify(result.ops, undefined, 2));
        });

        client.close();
    }
});

// --- Mongo Notes ---
// Using ES6 Object Destructuring this const MongoClient = require('mongodb').MongoClient; can become this const {MongoClient} = require('mongodb');
// Since ObjectID is also part of mongodb, you can add that in the same destrucuring process and have this const {MongoClient, ObjectID} = require('mongodb');

// ObjectID is used when querying the database. For example _id: new ObjectID('5a6273850bd00930446d7722') will find the object in the db with that id.
// Calling ObjectID() with no parameters returns a random _id for inserts. This is demonstrated above with a console log. It happens behind the scenes in production.

// --- Creating a Collection ---
// myDb.collection('Users').insertOne({
        //     name: 'David Ridgley',
        //     age: 32,
        //     location: 'Columbus, IN'
        // }, (err, result) => {
        //     if (err) {
        //         return console.log('Unable to insert user', err);
        //     }

        //     console.log(JSON.stringify(result.ops, undefined, 2));
        // });

// If the collection Users does not exist, this will create it and add the data to the user collection.
// The ops attribute in result.ops stores all the documents that were inserted.
