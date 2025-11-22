const mongoose = require("mongoose");

var conn = mongoose
  .connect(
    "mongodb+srv://JVKE:JVKE2006@cluster0.cjtyg.mongodb.net/chatooriZubaan?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )

  .then(() => console.log("Connection successfully..."))
  .catch((err) => console.log("err"));

module.exports = conn;
