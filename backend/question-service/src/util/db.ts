import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/peerprep", {});
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};
