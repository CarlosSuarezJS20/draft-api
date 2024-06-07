const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    imageURL: {
      type: String,
      require: false,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "Creator",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
