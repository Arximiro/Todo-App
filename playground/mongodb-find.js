const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        console.log('Unable to connect to MongoDB server');
    } else {
        console.log('Connected to MongoDB server');
        const myDb = db.db('TodoApp');
        
        // myDb.collection('Todos').find({
        //     _id: new ObjectID('5a6273850bd00930446d7722')
        // }).toArray().then((docs) => {
        //     console.log('Todos');
        //     console.log(JSON.stringify(docs, undefined, 2));
        // }).catch((err) => {
        //     console.log('Unable to fetch todos', err);
        // });

        myDb.collection('Users').find({
            name: 'David Ridgley'
        }).toArray().then((users) => {
            console.log('Results');
            console.log(JSON.stringify(users, undefined, 2));
        }).catch((err) => {
            console.log('Unable to fetch todos', err);
        });

        // myDb.collection('Todos').find().count().then((count) => {
        //     console.log(`Todos Count: ${count}`);
        // }).catch((err) => {
        //     console.log('Unable to fetch todos', err);
        // });

        db.close();
    }
});
