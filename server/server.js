const express = require("express");
const app = express();
const db = require("../db");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const bcrypt = require("../bcrypt");
const ses = require("./ses");
const cryptoRandomString = require("crypto-random-string");
const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3");
//socket code
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

//middlewares
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
    sameSite: true,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.json());

app.get("/user/id.json", function (req, res) {
    console.log("session: ", req.session);
    res.json({
        userId: req.session.userId,
    });
});

app.get("/user", (req, res) => {
    //console.log("resquest get user: ", req.body);
    db.getUser(req.session.userId)
        .then((result) => {
            //console.log("we see result: ", result);
            const { first, last, imageurl, bio } = result.rows[0];
            return res.json({ first, last, imageUrl: imageurl, bio });
        })
        .catch((err) => {
            console.log("we have an error here: ", err);
            return res.json({
                success: false,
                errorMessage: "Ops! Something went wrong",
            });
        });
});

app.post("/register", (req, res) => {
    //console.log("req.body: ", req.body);
    if (
        !req.body.first ||
        !req.body.last ||
        !req.body.email ||
        !req.body.password
    ) {
        res.json({
            success: false,
            errorMessage: "Ops! Something went wrong",
        });
    }
    bcrypt
        .hash(req.body.password)
        .then((result) => {
            return db
                .userRegister(
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    result
                )
                .then((result) => {
                    console.log("here result rows: ", result.rows);
                    req.session.userId = result.rows[0].id;
                    res.json({ success: true });
                });
        })
        .catch((err) => {
            console.log("we have an error here: ", err);
            res.json({
                success: false,
                errorMessage: "Ops! Something went wrong",
            });
        })
        .catch((err) => {
            console.log("we have an error here: ", err);
            res.json({
                success: false,
                errorMessage: "Ops! Something went wrong",
            });
        });
});

app.post("/login", (req, res) => {
    console.log("post login working", req.body);
    db.getEmail(req.body.email).then((result) => {
        if (result.rows[0]) {
            bcrypt
                .compare(req.body.password, result.rows[0].hashedpassword)
                .then((match) => {
                    console.log("result: ", match);
                    if (match) {
                        req.session.userId = result.rows[0].id;
                        return res.json({ success: true });
                    } else {
                        console.log("bad password: ");
                        return res.json({
                            success: false,
                            errorMessage: "Ops! Something went wrong",
                        });
                    }
                })
                .catch((err) => {
                    console.log("we have an error here: ", err);
                });
        } else {
            console.log("bad password: ");
            return res.json({
                success: false,
                errorMessage: "Ops! Something went wrong",
            });
        }
    });
});

app.post("/reset/start", (req, res) => {
    console.log("request email in body: ", req.body.email);
    db.getEmail(req.body.email).then((results) => {
        const secretCode = cryptoRandomString({ length: 6 });
        console.log(
            "results email, secretCode: ",
            results.rows[0].email,
            secretCode
        );
        db.insertCode(results.rows[0].email, secretCode)
            .then(() => {
                //console.log("result from insertCode: ", result.rows[0].code);
                ses.sendEmail(
                    `funky.chicken@spiced.academy`,
                    secretCode,
                    "Here the code to reset Password"
                );
                res.json({ success: true });
            })
            .catch((err) => {
                console.log(
                    "there is an error at the time to insert the code: ",
                    err
                );
                res.json({
                    success: false,
                    errorMessage: "Ops! Something went wrong",
                });
            });
    });
});

app.post("/reset/verify", (req, res) => {
    console.log("get verify runs when user enters code/new pass");
    db.findCode(req.body.email)
        .then((result) => {
            //if req.body=rows[0].code, hash the password and update the user's row in the users table
            if (req.body.code === result.rows[0].code) {
                //hash the password and update the user's row in the users table
                bcrypt
                    .hash(req.body.newpassword)
                    .then((result) => {
                        console.log("let's see result: ", result);
                        return db
                            .updatePassword(req.body.email, result)
                            .then(() => {
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log(
                                    "here an error update password: ",
                                    err
                                );
                                res.json({
                                    success: false,
                                    errorMessage:
                                        "Your password wasn't updated",
                                });
                            });
                    })
                    .catch((err) => {
                        console.log("here an error hash password: ", err);
                    });
            } else {
                console.log("here an error, the codes are no the same");
            }
        })
        .catch((err) => {
            console.log("err: ", err);
            res.json({
                success: false,
                errorMessage: "An error happens",
            });
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("request body", req.body, "request file", req.file);
    //concatenate the url that is the amazon url + the filename
    db.getUploaded(
        req.session.userId,
        `https://s3.amazonaws.com/spicedling/${req.file.filename}`
    )
        .then((result) => {
            res.json({
                imageUrl: result.rows[0].imageUrl,
            });
        })
        .catch((err) => console.log("err", err));
});

app.post("/profile/bio", (req, res) => {
    console.log("post request bio profile running", req.body);
    db.updateBio(req.body.bio, req.session.userId)
        .then((result) => {
            res.json({ success: true, bio: result.rows[0].bio });
        })
        .catch((err) => {
            console.log("we have an error here: ", err);
            res.json({ success: false });
        });
});

app.get("/api/user/:id", (req, res) => {
    console.log("we see req parameter", req.params);
    //req.params is an object containing parameter values parsed from the URL path
    db.getAnotherUser(req.params.id)
        .then((results) => {
            res.json({ succes: true, object: results.rows[0] });
        })
        .catch((err) => {
            console.log("err", err);
            res.json({ success: false });
        });
});

app.get("/api/findpeople", (req, res) => {
    console.log("hello from get findpeople: ", req.body);
    db.getLimitUsers()
        .then((result) => {
            console.log(result.rows);
            res.json({ users: result.rows });
        })
        .catch((err) => {
            console.log("we have an error in search people: ", err);
            res.json({ success: false });
        });
});

app.get("/api/findpeople/:searchTerm", (req, res) => {
    console.log("request params: ", req.params.searchTerm);
    db.getMatchUsers(req.params.searchTerm)
        .then((result) => {
            console.log("we search for users here: ", result);
            res.json({ searchTerm: result.rows });
        })
        .catch((err) => {
            console.log("here an error find people search term: ", err);
            res.json({ success: false });
        });
});

app.get("/checkFriendStatus/:otherId", (req, res) => {
    console.log("check other user id: ", req.params.otherId);
    db.friendStatus(req.session.userId, req.params.otherId)
        .then((result) => {
            console.log("results: ", result.rows);
            if (!result.rows[0]) {
                res.json({ buttonText: "Add Friend" });
            } else if (result.rows[0].accepted) {
                res.json({ buttonText: "Unfriend" });
            } else if (!result.rows[0].accepted) {
                if (result.rows[0].sender_id == req.session.userId) {
                    res.json({ buttonText: "Cancel Friend Request" });
                } else {
                    res.json({ buttonText: "Accept Friend Request" });
                }
            }
        })
        .catch((err) => {
            console.log("here an error frienship status: ", err);
            res.json({ success: false });
        });
});

app.post("/friend", (req, res) => {
    console.log("friendship post request running");
    console.log("request body: ", req.body);
    const buttonData = req.body.buttonText;
    const otherId = req.body.otherId;

    if (buttonData == "Add Friend") {
        db.friendRequest(req.session.userId, otherId)
            .then((result) => {
                res.json({
                    buttonText: "Cancel Friend Request",
                    otherId: result.recipient_id,
                });
            })
            .catch((err) => {
                console.log("here an error frienship request: ", err);
                res.json({ success: false });
            });
    } else if (buttonData == "Accept Friend Request") {
        db.friendAccept(req.session.userId, otherId)
            .then((result) => {
                res.json({
                    buttonText: "Unfriend",
                    otherId: result.recipient_id,
                });
            })
            .catch((err) => {
                console.log("here an error frienship accept: ", err);
                res.json({ success: false });
            });
    } else if (
        buttonData == "Cancel Friend Request" ||
        buttonData == "Unfriend"
    ) {
        db.friendDelete(req.session.userId, otherId)
            .then((result) => {
                res.json({
                    buttonText: "Add Friend",
                    otherId: result.recipient_id,
                });
            })
            .catch((err) => {
                console.log("here an error frienship accept: ", err);
                res.json({ success: false });
            });
    }
});

app.get("/friends-and-wannabees", (req, res) => {
    console.log("get request friends and wannabees runs:");
    db.getFriendsAndWannabees(req.session.userId)
        .then((result) => {
            console.log("friends and wannabees: ", result.rows);
            res.json({ friendsAndWannabees: result.rows });
        })
        .catch((err) => {
            console.log("here an error in friends and wannabees: ", err);
        });
});

app.post("/friend/end", (req, res) => {
    const otherId = req.body.otherId;
    db.friendDelete(req.session.userId, otherId)
        .then(() => {
            res.json({ succes: true });
        })
        .catch((err) => {
            console.log("error button cancel: ", err);
            res.json({ success: false });
        });
});

app.post("/friend/add", (req, res) => {
    const otherId = req.body.otherId;
    db.friendAccept(req.session.userId, otherId)
        .then(() => {
            res.json({ succes: true });
        })
        .catch((err) => {
            console.log("error update button: ", err);
            res.json({ success: false });
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening on 3000");
});

//socket
//socket.io adds to socket objects a request property
io.on("connection", function (socket) {
    const userId = socket.request.session.userId;
    if (!userId) {
        return socket.disconnect(true);
    }
    console.log("userId:", userId);

    db.getLastMessages()
        .then(({ rows }) => {
            console.log("last-10-messages", rows);
            socket.emit("chatMessages", rows.reverse());
        })
        .catch((err) => {
            console.log("error in socket: ", err);
        });

    socket.on("newmessage", (message) => {
        console.log(message, userId);
        db.addMessage(message, userId)
            .then(() => {
                db.getLastMessages().then(({ rows }) => {
                    console.log("add info:", rows);
                    io.emit("chatMessage", rows[0]);
                });
                console.log("added messages");
            })
            .catch((err) => {
                console.log("error in socket adding messages: ", err);
            });
    });
});
