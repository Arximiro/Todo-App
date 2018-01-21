const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        console.log('Unable to connect to MongoDB server');
    } else {
        console.log('Connected to MongoDB server');
        const myDb = db.db('TodoApp');
        
        // deleteMany
        myDb.collection('Todos').deleteMany({text: 'Buy Groceries'}).then((result) => {
            console.log(result);
        });

        // deleteOne
        myDb.collection('Todos').deleteOne({text: 'Pet the cats'}).then((result) => {
            console.log(result);
        });

        //findOneAndDelete
        myDb.collection('Todos').findOneAndDelete({_id: ObjectID('5a6275ee6225a139f0708a09')}).then((result) => {
            console.log(JSON.stringify(result, undefined, 2));
        });

        db.close();
    }
});


// --- Notes ---
// This is a demonstration of the multiple ways you can delete data from Mongo.
// They are pretty self explanatory, however findOneAndDelete returns the deleted item.
// This can be used to for example add an undo option incase the user didn't mean to delete an item.
