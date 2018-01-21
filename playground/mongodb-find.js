const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        console.log('Unable to connect to MongoDB server');
    } else {
        console.log('Connected to MongoDB server');
        const myDb = client.db('TodoApp');
        
        myDb.collection('Todos').find({
            _id: new ObjectID('5a6273850bd00930446d7722')
        }).toArray().then((docs) => {
            console.log('Todos');
            console.log(JSON.stringify(docs, undefined, 2));
        }).catch((err) => {
            console.log('Unable to fetch todos', err);
        });

        

        myDb.collection('Todos').find().count().then((count) => {
            console.log(`Todos Count: ${count}`);
        }).catch((err) => {
            console.log('Unable to fetch todos', err);
        });

        client.close();
    }
});

// --- Notes ---
// Demonstrated in this file is multiple ways to query data from Mongo.
// find() can be used to search for an entry by id or any other field, then you can do with that object what you wish.
// The first example up top parses whatever is returned into an array, and then prints that array to the console.
// The second example searches the Todos collection, and finds everything, and gets the count. Then it prints the count to the console.
