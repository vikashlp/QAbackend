const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongo = mongoose
  .connect("mongodb://localhost:27017/qabackend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Database connected`);
  })
  .catch((err) => console.log(err.message));

module.exports = mongo;
