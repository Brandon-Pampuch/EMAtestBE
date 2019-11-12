const mongoose = require('mongoose');


const connectDb = () => {
    return mongoose.connect("mongodb+srv://brandonpampuch:Whatthea1@cluster0-m8a9e.mongodb.net/test?retryWrites=true&w=majority");
};




module.exports = {
    connectDb: connectDb
}


