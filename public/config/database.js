const mongoose = require('mongoose');
const {MONGO_URI} = process.env;

exports.connect = ()=>{
    mongoose.set("strictQuery", false);
    mongoose.connect(MONGO_URI)
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>{
        console.log("failed to connect with DB");
        console.log(err);
        process.exit(1);
    });
};