const mongoose = require("mongoose");
const { Schema } = mongoose;

const creatorSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Creator", creatorSchema);
