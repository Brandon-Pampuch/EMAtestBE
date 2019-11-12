const mongoose = require('mongoose')

// remote db string
const Mongo_uri = "mongodb+srv://brandonpampuch:Whatthea1@cluster0-m8a9e.mongodb.net/test?retryWrites=true&w=majority"

//ES6 Promises
mongoose.Promise = global.Promise

// connect to DB before running tests
before((done) => {
    mongoose.connect(Mongo_uri, { useNewUrlParser: true });

    mongoose.connection.once('open', () => {
        console.log("the eagle has landed")
        done()
    }).on('error', (error) => {
        console.log("connection error", error)
    })
})