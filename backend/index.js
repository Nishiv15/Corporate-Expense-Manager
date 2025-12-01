import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import companyRoutes from "./routes/companyRoutes.js";
import userRoutes from "./routes/userRoutes.js";


dotenv.config();
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// database
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/companies", companyRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
