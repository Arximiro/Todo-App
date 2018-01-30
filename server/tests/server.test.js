const { ObjectID } = require('mongodb');
const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { users, populateUsers, todos, populateTodos } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

// --- Mocha Notes ---
// describe creates a block for the tests that describes what they do and shows in the output. It's not required but makes the tests look more organized.
// it() is how mocha starts a test. The first argument is what the test should do, the second argument is the function that runs and the expect calls.

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text)
                    done();
                }).catch((e) => done(e));
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
                        expect(todos.length).toBe(3);
                        done();
                    }).catch((e) => done(e));
                }
            });
    });

});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(3);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should get todo doc by id', (done) => {
        const id = todos[0]._id.toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        const id = ObjectID();
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 400 due to invalid id', (done) => {
        const id = '123abc';
        request(app)
            .get(`/todos/${id}`)
            .expect(400)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        const id = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(id).then((res) => {
                    expect(res).toBeFalsy();
                    done();
                }).catch((e) => done(e));

            });
    });

    it('should return 404 if todo not found', (done) => {
        const id = ObjectID();
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 400 id invalid ID', (done) => {
        const id = '123abc';
        request(app)
            .delete(`/todos/${id}`)
            .expect(400)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        const id = todos[0]._id.toHexString();
        const body = { text: 'Updated todo', completed: true }
        request(app)
            .patch(`/todos/${id}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done)
    });

    it('should clear completedAt when todo is not complete', (done) => {
        const id = todos[1]._id.toHexString();
        const body = { text: 'Updated todo#2', completed: false }
        request(app)
            .patch(`/todos/${id}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});


// --- POST /Todos Notes ---
// In the POST Todos test, the request method from supertest is called, passing in app, which is the server.js file.
// Then it does a post request to the /todos url, and sends the text variable created above.
// After that a Supertest expect call is made, expecting a status code of 200 which is OK.
// Next a Supertest expect function is created. Inside of this the expect library can be used to expect different things.
// The Supertest expection function takes in the response, and expects the body.text property of the response to match the text variable we created above.
// After that .end is called, which takes two args, an error and the response. If there was an error in the above calls, then done is called ending the testing.
// If there was no error the testing continues, next up calling find({text}) to search all entries in the collection
// for an entry with the text matching the text variable, then using the returned promise to take what was found and make assertions.
// First epxecting the length of the returned object toBe 1, and expecting the text property of the 1st obj in the returned array to match the text variable.
// After that done() is called ending the testing, and lastly if there was any errors those are caught, then done is called passing in that error.
// In the 2nd POST todos test, invalid data is used in the form of an empty object.
// The first assertion is that a status code 400 should be returned which is Bad Request.
// Then at the end the last assertion is that the length of the todos collection is 3.


// --- GET Todos Notes ---
// In this test, all that's being done is fetching the todos from the collection and making sure the length of the returned array is correct.

// --- GET Todos/:id Notes ---
// In these tests, data is being fetched from the collection based off the _id.
// A const is created with a legit _id from one of the seed todos, converted to a hex string which is an object, which is needed for comparison in expect.
// The first test uses the legitimate _id from one of the seed todos, making sure a 200 OK is returned. The returned todo's _id is compared with the one requested.
// The second test uses a properly formatted ObjectID to simulate an id being passed in that has the correct format, but is not found, returning a 404 not found.
// The third test uses an intentionally improper id, making sure a 400 for bad request is returned.

// --- DELETE Todos/:id Notes ---
// In these tests, data is being deleted from the collection based off the _id.
// A const is created with a legit _id from one of the seed todos, converted to a hex string which is an object, which is needed for comparison in expect.
// The first test attempts to delete a todo by the _id value. A valid _id from one of the seed todos is passed in.
// The second test passes in a properly formatted _id, but for a todo that does not exist.

// --- PATCH Todos/:id Notes ---
// In the first test, some dummy data is created to update the todo. It is then sent to the url using send.
// The return data is processed, making sure the data on the returned todo matches what was sent.
// The second test updates a todo changing completed status to false.
// Then it expects the returned todo to make sure completed was updated and completedAt was set back to its default value null.















describe('POST /users', () => {
    it('should create a user', (done) => {
        const email = 'test@test.com';
        const password = 'abcd1234';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({ email }).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return validation errors for invalid request', (done) => {
        const email = 'test@test';
        const password = 'abcd';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done)
    });

    it('should not create user if email in use', (done) => {
        const email = 'david@example.com';
        const password = 'abcd1234';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done)
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        const email = 'pete@example.com';
        const password = 'petepass';
        const _id = users[1]._id;

        request(app)
            .post('/users/login')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(_id).then((user) => {
                    expect(user.toObject().tokens[1]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should reject invalid login', (done) => {
        const email = 'pete@example.com';
        const password = 'petepass1';
        const _id = users[1]._id;

        request(app)
            .post('/users/login')
            .send({ email, password })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(_id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            });
    });
});


// --- POST /users Notes ---
// Some dummy data is created to be used on the test to create a new user.
// The usual happens making assertions about the response.
// The header is checked to make sure the 'x-auth' digital signature is present.
// The password is checked to make sure the plain text password was not the one stored in the DB.
// Some other tests are ran with invalid data to make sure the proper resonse is returned.

// --- POST /users/login Notes ---
// Some dummy data is created for use int he dest.
// The data is sent off, then an assertion is made about the response, expecting the x-auth signature to be present.
// The DB is searched for the user, then the tokens array assertion is made, expecting the new user to have an
// item in it's array at that position containing those properties.
// The next test using an invalid password to make sure the login is rejected.
