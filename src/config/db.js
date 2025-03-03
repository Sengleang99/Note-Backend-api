const mongoose = require('mongoose'); // Fix typo from moogose to mongoose
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI);
};

module.exports = connectDB;
