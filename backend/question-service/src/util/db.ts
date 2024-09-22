import mongoose from "mongoose";

export const connectToDB = async (uri: string) => {
  try {
    await mongoose.connect(uri, {});
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};
