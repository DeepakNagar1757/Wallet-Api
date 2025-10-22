import ratelimit from "../config/upstash.js"

const rateLimiter =  async (req,res,next) =>{
    try {
        // userId, Ip Adress in production Grades
        const {success} = await ratelimit.limit("My-rate-limit")
        if(!success){
            return res.status(429).json({
                message: "Too many requests, please try again later."
            })
        } 
        next()  
    } catch (error) {
        console.log("Rate Limit Error : ", error);
        next(error)                
    }
}


export default rateLimiter