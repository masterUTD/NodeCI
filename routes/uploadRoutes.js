const AWS = require('aws-sdk');
const keys = require('../config/keys')
const { v4: uuidv4 } = require('uuid');
const requireLogin = require('../middlewares/requireLogin');

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey

})

module.exports = (app) => {
    app.get('/api/upload', requireLogin, (req, res) => {

        const key = `${req.user.id}/${uuidv4()}.jpeg`

        s3.getSignedUrl('putObject',  // name of the function to upload a file to s3, tiene que ser putObject no se puede cambiar
        {
            Bucket: 'my-personal-blog-bucket-unique',
            ContentType: 'image/jpeg',
            Key: key

        }, (err, url) => res.send({ key, url}));

    });

};