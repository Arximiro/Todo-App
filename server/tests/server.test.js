const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/todo');

beforeEach((done) => {
    Todo.remove({}).then(() => done());
});

describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        const text = 'Test todoss text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    Todo.find().then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text)
                        done();
                    }).catch((e) => done(e));
                }
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    Todo.find().then((todos) => {
                        expect(todos.length).toBe(0);
                        done();
                    }).catch((e) => done(e));
                }
            });
    });

});

// --- POST Todos Notes ---
// describe creates a block for the tests that describes what they do and shows in the output. It's not required but makes the tests look more organized.
// it() is how mocha starts a test. The first argument is what the test should do, the second argument is the function that runs and the expect calls.
// In the POST test, the request method from supertest is called, passing in app, which is the server.js file.
// Then it does a post to the /todos url, and sends the text variable created above.
// After that the expect calls are made, expecting a status code of 200 which is OK.
// Since an object with the response is returned from the post, the next expect call takes that object and checks to make sure the body matches the text varaible.
// After that .end is called, which takes two args, an error and the response. If there was an error in the above calls, then done is called ending the testing.
// If there was no error the testing continues, calling find() to search all entries in the db and using the returned promise to take what was found and make assertions.
// First epxecting the length of the returned object toBe 1, and expecting the text property of the 1st obj in the returned array to match the text variable.
// After that done() is called ending the testing, and lastly if there was any errors those are caught, then done is called passing in that error.

// In the 2nd POST todos test, invalid data is used in the form of an empty object.
// The first assertion is that a status code 400 should be returned which is Bad Request.
// Then at the end the last assertion is that the length of the todos collection is 0.
