import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./Routes/transactionsRoute.js"
import job from "./config/cron.js";
dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

if(process.env.NODE_ENV === "production"){
    job.start();
}

// middleware
app.use(rateLimiter);
app.use(express.json());


app.get("/api/health", (req, res) => {
    res.status(200).json({message: "API is healthy"});
})

app.use("/api/transactions", transactionsRoute)

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("server is Up and runnng on PORT: ", PORT);
    })
})