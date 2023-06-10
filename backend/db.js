const mongoose = require("mongoose");

const connectdb = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://shashankkrishu99:VqT1sedW9EuJAZ5K@cluster0.v8mg2zj.mongodb.net/",
      {
        useUnifiedTopology: true
      }
    );
    console.log(`db connection established.... ${conn.connection.host}`);
  } catch (err) {
    console.log(err.message);
    process.exit();
  }
};

module.exports = connectdb;
