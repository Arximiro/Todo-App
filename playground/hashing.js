const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// --- Bcrypt Notes ---
// First a password const is created with a value.
// Next a random salt is generated. in genSalt() the first arg is the number of rounds to go through next is a callback function.
// The more rounds it goes through the slower it is, creating a more secure hash. Consider the rounds to be like a speed dial.
// In the callback function you can run hash(), passing in the plain text pw, the random salt, and another callback function.
// If successful the hash() method returns the hashed pw with the salt added in.

// The generated hash will be different every time, since it's a random salt, however that salt is stored in the hash, so you can still compare the two.
// Next a const is created with one of the hashed results from code above. Since the salt is contained within the hash itself, compare() can be used.
// Compare takes 3 args. First the plain text pw, then the hashed pw, then a callback function that either throws an error or returns true or false if they match.
// Compare looks at the plain text, looks at the hash, finds the salt, hashes the plain text using that salt, then compares it to the hashedPassword passed in.

const password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

const hashedPassword = '$2a$10$e99cmnI6bEHVbXRf4FqgnOAqPq0e60XrLir6Vmd7TvltD6k1bsULy';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});
// ---------------------------------------------------------------------------------------------------------------------------------------







// ---------- Token Notes ----------------------------------------------------------------------------------------------------------------
// First an object with the id of 10 is created.
// Then the object is signed with jwt.sign() using the salt '123abc'. jwt is JsonWebToken
// Next the encoded version of the token is logged to the console.
// using jwt.verify() the token is decoded with the salt '123abc' as the signature, then it is logged to the console.
// This example code demonstrates a token that the server and client send back and forth for verification.

// const data = { id: 10 };

// const token = jwt.sign(data, '123abc');
// console.log('Encoded Version:', token);

// const decoded = jwt.verify(token, '123abc');
// console.log('Decoded Version:', decoded);


// const message = 'I am user number 3';
// const hash = SHA256(message)

// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);
// ---------------------------------------------------------------------------------------------------------------------------------------








// ------------------ General Hash Notes -------------------------------------------------------------------------------------------------
// First an object with the property id with a value of 4 is created.
// Then an object called token is created with property a being that data object with id: 4, and b being a hash property.
// In the hash property the data object value is hashed, using salt 'somesecret', then converting to string, then logged to the console.
// Next the data property of the token object is changed to id: 5, then the token.hash property is run again, using that new value of id.
// next token.hash is logged to the console again showing that it's indeed very different even though the data only slightly changed.

// Finally a constant called resultHash is created, making a string using the exact same data for its hash.
// This is compared below to determine if the data is the same, similar to verification that would exist in the real world.
// Since a value hashed in the exact same way with the same salt will return the same value the if comes back as true, so the data was not changed.

// const data = { id: 4 };

// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
// console.log(token.hash);

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// console.log(token.hash);

// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// console.log(resultHash);

// if (resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Do not trust!');
// }
// ---------------------------------------------------------------------------------------------------------------------------------------

// --- What is Hashing? ---
// Hashing takes a plain text value and hashes it into a bunch of jibberish.
// It's a one way street, so when the user enters their username or password, it gets hashed, then the hashed value is stored on the server and not the plain text value.
// To prevent a malicious user from just updating the user id, then rehashing it using the same hash we do, then doing something malicious to that user, a salt is used.
// A salt is a secret random string we have stored on the server that is added to the plain text before the value is hashed.
