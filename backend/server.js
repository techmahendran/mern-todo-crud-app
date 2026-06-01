import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import dns from "dns";
import todoRoutes from "./routes/todo.route.js";
import cors from 'cors'
import path from 'path'

const PORT = process.env.PORT || 5000;

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const app = express();

app.use(express.json());
// app.use(cors()); // Enable CORS for all routes

app.use("/api/todos", todoRoutes);

const __dirname = path.resolve()

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')))
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", 'dist', 'index.html'))
  })
}

app.get("/", (req, res) => {
  res.send("<h1>Server is Running</h1>");
});

app.listen(5000, () => {
  connectDB();

  console.log(`Server is running on http://localhost:${PORT}`);
});
