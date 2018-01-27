const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

const data = { id: 10 };

const token = jwt.sign(data, '123abc');
console.log('Encoded Version:', token);

const decoded = jwt.verify(token, '123abc');
console.log('Decoded Version:', decoded);

// const message = 'I am user number 3';
// const hash = SHA256(message)



// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);

// const data = {
//     id: 4
// };

// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// console.log(token.hash);

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// console.log(token.hash);

// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Do not trust!');
// }

// --- Hash Notes ---
// Hashing takes a plain text value and hashes it into a bunch of jibberish.
// It's a one way street, so when the user enters their username or password, it gets hashed, then the hashed value is stored on the server and not the plain text value.
// To prevent a malicious user from just updating the user id, then rehashing it using the same hash we do, then doing something malicious to that user, a salt is used.
// A salt is a secret random string we have stored on the server that is added to the plain text before the value is hashed.
