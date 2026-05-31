import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import dns from "dns";
import todoRoutes from "./routes/todo.route.js";


dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/todos", todoRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Server is Running</h1>");
});

app.listen(5000, () => {
  connectDB();

  console.log("Server is running on http://localhost:5000");
});
