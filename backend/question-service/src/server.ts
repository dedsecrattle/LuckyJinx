import express, { Application } from "express";
import bodyParser from "body-parser";
import questionRoutes from "./routes/questionRoutes";
import { connectToDB } from "./util/db";

// Initialize the app
const app: Application = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/questions", questionRoutes);

// Start the server
app.listen(PORT, () => {
  connectToDB();
  console.log(`Server running on port ${PORT}`);
});
