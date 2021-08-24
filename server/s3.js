const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("../secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("we see if we dont have a file");
        return res.sendStatus(500);
    }
    console.log("req.file inside upload function in s3.js -->", req.file);
    //here we should have an image/file to upload
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            // this works when image uploaded to AWS
            console.log("this is from s3.js, amazon upload complete");
            next();
        })
        .catch((err) => {
            // uh oh
            console.log("error in putObj in s3.js --->", err);
        });
};
