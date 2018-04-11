const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', async (err, client) => {
    if (err) {
        console.log('Unable to connect to MongoDB server');
    } else {
        console.log('Connected to MongoDB server');
        const myDb = client.db('TodoApp');
        
        try {
          const ref = await myDb.collection('todos').find().toArray();
          console.log('todos');
          console.log(JSON.stringify(ref, undefined, 2));
        } catch (e) {
          console.log('Unable to fetch todos', e);
        };

        try {
          const ref = await myDb.collection('todos').find().count();
          console.log(`todos count: ${ref}`);
        } catch (e) {
          console.log('Unable to fetch todos', e);
        }

        client.close();
    }
});

// --- Notes ---
// Demonstrated in this file is multiple ways to query data from Mongo.
// find() can be used to search for an entry by id or any other field, then you can do with that object what you wish.
// find() returns a cursor or reference, we must parse that data to view it.
// The first example up top parses whatever is returned into an array, and then prints that array to the console.
// The second example searches the Todos collection, and finds everything, and gets the count. Then it prints the count to the console.

// For example:

// myDb.collection('todos').find({
//   _id: new ObjectID('5a6273850bd00930446d7722')
// });

// will query the todos collection and find the record with that ObjectID. Since the id is an ObjectID and not a string, it must be wrapped by ObjectID.
// This converts it to the ObjectID which holds multiple identifying pieces of information like timestamp, machine code, process id, and more.
