import mongoose from "mongoose";

const download = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Number: {
      type: String,
      required: true,
    },
    Link: {
      type: String,
      required: true,
    },
    Info: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Download = mongoose.model("Download", download);

export default Download;
