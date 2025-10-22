import { sql } from "../config/db.js";

export async function getTransactionsbyUserId(req, res){
        try {
            const { userId } = req.params;
            
            const transactions = await sql`SELECT * FROM TRANSACTIONS WHERE user_id = ${userId} ORDER BY created_at DESC`
            return res.status(200).json(transactions)
        } catch (error) {
            console.log("Error Fetching User Transactions : ", error);
            return res.status(500).json({message : "Internal server Error"})               
        }
    
}

export async function createTransactions(req, res){
    try {
            const {user_id, title, amount, category} = req.body;
    
            if(!user_id || !title || amount === undefined || !category){
                return res.status(400).json({message : "All fields are required"})
            }
    
            const transactions = await sql`
            INSERT INTO transactions(user_id, title, amount, category)
            VALUES(${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
            `
            console.log(transactions);
            return res.status(201).json(transactions[0])
    
        } catch (error) {
                console.log("Error creating the transaction : ", error);
                return res.status(500).json({message : "Internal server Error"})                    
        }
}

export async function deleteTransactions(req, res){
    try {
            const { id } = req.params;
    
            if (isNaN(parseInt(id))) {
                return res.status(400).json({ message: "Invalid transaction ID" });           
            }
            const result = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`
            
            if(result.length === 0 ){
               return res.status(404).json({message : "Transaction not found"})
            }
            
            return res.status(200).json({message : "Transaction deleted successfully"})
    
        } catch (error) {
            console.log("Error Deleting User Transactions : ", error);
            return res.status(500).json({message : "Internal server Error"})                
        }
}

export async function getSummaryTransactions(req, res){
    try {
        const { userId } = req.params;
        const balanceAmount = await sql`
            SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}
        `

        const incomeAmount = await sql`
            SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
        `

        const expenseAmount = await sql`
            SELECT COALESCE(SUM(amount),0) as expense FROM transactions WHERE user_id = ${userId} AND amount < 0
        `

        return res.status(200).json({
            balance : balanceAmount[0].balance,
            income : incomeAmount[0].income,
            expense : expenseAmount[0].expense
        })

    } catch (error) {
        console.log("Error getting Summary Transactions: ", error);
        return res.status(500).json({message : "Internal server Error"})                
    }
}