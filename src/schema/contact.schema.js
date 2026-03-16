import mongoose from "mongoose";

const contact = new mongoose.Schema(
  {
    First_Name: {
      type: String,
      required: true,
    },
    Last_Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Contact_Number: {
      type: String,
      required: true,
    },
    Message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contact);

export default Contact;
