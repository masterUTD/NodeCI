jest.setTimeout(30000)// to change the default time to run each test // i changed it to 30 seconds
const mongoose = require('mongoose')
const keys = require('../config/keys')


mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });