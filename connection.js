const mongoose = require('mongoose');

function connectToMongoDb(url){
    return mongoose.connect(url).then(()=>{
        console.log('MongoDb Connected Successfully!');
    }).catch((error)=>{
       console.log('An error occurred while connecting to MongoDb:',error.message);
    })
}

module.exports = {connectToMongoDb}