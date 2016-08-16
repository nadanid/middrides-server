const CONSTANTS = require("../config/constants");

/**
 * Handle general server internal error
 * 
 * res {
 *      error
 * }
 */
function handleError(err, res) {
    console.log(err.message);
    res.status(500).json({
        error: "Internal Server Error"
    });
}

/**
 * Find user in database
 */
function findUser(db, email, callback) {
    db.collection(CONSTANTS.COLLECTION.USER).findOne({
        email: email
    }, function(err, doc) {
        if (err) { callback(err, null); }
        else if (!doc) { callback(null, null); }
        else callback(null, getUserFromBsonWithPassword(doc));
    });
}

/**
 * Create user in database
 */
function createUser(db, email, password, callback) {
    db.collection(CONSTANTS.COLLECTION.USER).insertOne({
        email: email,
        password: password,
        verified: false
    }, function(err, result) {
        if (err) callback(err, null);       // back to router for handling
        else {
            findUser(db, email, function(err, user) {
                if (err) callback(err, null);
                else callback(err, getUserFromBson(user));
            });
        }
    });
}

/**
 * Turns bson user into json
 */
function getUserFromBson(doc) {
    var user = {};
    user['email'] = doc.email;
    user['verified'] = doc.verified;
    return user;
}

/**
 * Turns bson user into json with password field
 */
function getUserFromBsonWithPassword(doc) {
    var user = {};
    user['email'] = doc.email;
    user['verified'] = doc.verified;
    user['password'] = doc.password;
    return user;
}

module.exports = {
    handleError,
    findUser,
    createUser
}