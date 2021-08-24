const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

module.exports.userRegister = (first, last, email, hashedpassword) => {
    return db.query(
        `INSERT INTO users (first, last, email, hashedpassword) VALUES ($1, $2, $3, $4) RETURNING id`,
        [first, last, email, hashedpassword]
    );
};

module.exports.getEmail = (email) => {
    return db.query(`SELECT * FROM users WHERE email = '${email}'`);
};

//insert the secret code you generated with the help of cryptoRandomString
module.exports.insertCode = (email, code) => {
    return db.query(`INSERT INTO reset_codes (email, code) VALUES ($1, $2)`, [
        email,
        code,
    ]);
};

//select that finds code in the new table that matches the email address and is less than 10 minutes old
module.exports.findCode = (email) => {
    return db.query(
        `SELECT * FROM reset_codes WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes' AND email =($1)`,
        [email]
    );
};

//by update password of user's table by email address
module.exports.updatePassword = (email, hashedpassword) => {
    return db.query(`UPDATE users SET hashedpassword=$2 WHERE email=$1`, [
        email,
        hashedpassword,
    ]);
};

//make sure you do an UPDATE for the image in the users table rather than an insert (you'll need userId and imageUrl)
module.exports.getUploaded = (id, imageUrl) => {
    return db.query(
        `UPDATE users SET imageUrl = $2 WHERE id = $1 RETURNING imageUrl`,
        [id, imageUrl]
    );
};

module.exports.updateBio = (bio, id) => {
    return db.query(`UPDATE users SET bio =$1 WHERE id=$2 RETURNING bio`, [
        bio,
        id,
    ]);
};

module.exports.getUser = (id) => {
    console.log("query");
    return db.query(
        `SELECT first, last, email, imageUrl, bio FROM users WHERE id=$1`,
        [id]
    );
};

module.exports.getAnotherUser = (id) => {
    return db.query(
        `SELECT first, last, imageUrl, bio FROM users WHERE id=$1`,
        [id]
    );
};

//% matches any sequence of characters.
module.exports.getMatchUsers = (val) => {
    return db.query(
        `SELECT * FROM users 
  WHERE (first || ' ' || last) ILIKE $1`,
        [val + "%"]
    );
};

//select the first three rows
module.exports.getLimitUsers = () => {
    return db.query(
        `SELECT id, first, last, imageurl, bio FROM users ORDER BY id DESC LIMIT 3`
    );
};

//friendship status
module.exports.friendStatus = (userId, otherId) => {
    return db.query(
        `SELECT * FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)`,
        [userId, otherId]
    );
};

//friend request
//INSERT - runs when you send a friend request
module.exports.friendRequest = (sender_id, recipient_id) => {
    return db.query(
        `INSERT INTO friendships (sender_id, recipient_id)
        VALUES ($1,$2) RETURNING id, accepted`,
        [sender_id, recipient_id]
    );
};

//friend accept
//UPDATE - runs when you accept a friend request (false -> true)
module.exports.friendAccept = (otherId) => {
    return db.query(
        `UPDATE friendships SET accepted = 'true' WHERE (id = $1)  RETURNING accepted`,
        [otherId]
    );
};

//friend delete
//DELETE - runs when you end a friendship or cancel a friend request
module.exports.friendDelete = (userId, otherId) => {
    return db.query(
        `DELETE FROM friendships WHERE (sender_id=$1 AND recipient_id=$2) OR (sender_id=$2 AND recipient_id=$1)`,
        [userId, otherId]
    );
};

module.exports.getFriendsAndWannabees = (id) => {
    return db.query(
        `SELECT users.id, first, last, imageurl, accepted FROM friendships JOIN users ON (accepted = FALSE AND recipient_id = $1 AND sender_id = users.id) OR
                (accepted = TRUE AND recipient_id = $1 AND sender_id = users.id) OR
                (accepted = TRUE AND sender_id = $1 AND recipient_id = users.id)`,
        [id]
    );
};

//addMessage(text, userId): an INSERT query to save a new chat message
module.exports.addMessage = (text, user_id) => {
    return db.query(
        `INSERT INTO messages(text, user_id)
        VALUES ($1,$2)`,
        [text, user_id]
    );
};

//getLast10Messages(): a SELECT query to retrieve the 10 most recent messages
//The query will need to JOIN on the users table and you will probably want to include ORDER and LIMIT clauses.
module.exports.getLastMessages = () => {
    return db.query(
        `SELECT first, last, imageurl, text, created_at, user_id FROM messages JOIN users ON users.id = messages.user_id ORDER BY created_at DESC LIMIT 10`
    );
};
