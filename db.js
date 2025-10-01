// import mongoose from 'mongoose'; // es6

//Connection to mongoDB file
const mongoose = require("mongoose"); // commonjs module -default
require("dotenv").config();

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("connected to mongoDB");
}

module.exports = (connectDB, mongoose);

// }
module.exports = { connectDB, mongoose };
