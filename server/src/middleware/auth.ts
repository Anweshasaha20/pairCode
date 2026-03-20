import  jwt from 'jsonwebtoken'
import user from '../models/User'
import { configDotenv } from 'dotenv'
import { Request, Response , NextFunction } from 'express'
configDotenv()

const secret = process.env.PASS_KEY as any;
interface authRequest extends Request{
    user ?: any;
}


export const auth = async (req: authRequest, res: Response, next: NextFunction) => {
    // const token = req.cookies.token; // this throws error if req.cookies is undefined 
    try{
    const token = req.cookies?.token; // this checks if req.cookies is undefined or not if undeined it doesnt throw err 
    //rather it returns undefined
    if(!token){
        res.status(401).json({
            message : "Please register to proceed",
        });   
        return;   
    }
    // now token is present for sure
        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
        const userid = decoded.sub;
        const userdetail = await user.findOne({ email: userid });
        if (!userdetail) {
            res.status(401).json({
                message : "User not found",
            })
            return;
        }
        else{
            req.user = userdetail;
            next();
            return;
        }
    }
    catch(err){
        res.status(401).json({
            message : "Error in verifying token",
        })
        return;
    }
}