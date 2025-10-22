import express from "express";
import { createTransactions, deleteTransactions, getSummaryTransactions, getTransactionsbyUserId } from "../controller/transactionsController.js";


const router = express.Router();
router.get("/:userId", getTransactionsbyUserId)

router.post("/", createTransactions)

router.delete("/:id", deleteTransactions)

router.get("/summary/:userId", getSummaryTransactions)


export default router;