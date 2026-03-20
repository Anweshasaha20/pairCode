import axios from "axios";
import jwt from "jsonwebtoken";
import user from "../models/User";

export const githubRedirect = (req: any, res: any) => {
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user`;
    res.redirect(url);
}

export const githubCallback = async (req: any, res: any) => {
    const code = req.query.code as string ;

    try { // exchange code for the access token from github
        const tokenRes  = await axios.post(
             "https://github.com/login/oauth/access_token",
                {
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code,
                },
                {
                    headers : {Accept : "application/json"}, // tells github to return json rather than url
                }
        );
        const accessToken = tokenRes.data.access_token;

// get user 
        const userRes = await axios.get("https://api.github.com/user",{
            headers : {
                Authorization : `Bearer ${accessToken}`,
            }
        });

        console.log("GitHub user data:", userRes.data);

            // check if user already exists in our database
        let existingUser = await user.findOne({ githubId : userRes.data.id.toString()});
        
        if(!existingUser){
            existingUser = await user.create({
                username : userRes.data.login,
                githubId : userRes.data.id.toString(),
                email : userRes.data.email,
                avatarUrl : userRes.data.avatar_url,
            });
        }


        // create jwt
        const secret = process.env.PASS_KEY as string;
        const token = jwt.sign({ sub: existingUser._id.toString() }, secret, { expiresIn: "5h" });
        // setting cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                ? ("none" as const)
                : ("lax" as const),
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.redirect(`${process.env.CLIENT_URL}`);
    } catch (err) {
        console.error("GitHub OAuth error:", err);
        res.status(500).json({
            message: "GitHub authentication failed",
        });
    }
}

export const validateAuth = (req: any, res: any) => {
    if (req.user) {
        res.status(200).json({
            message: "Authenticated",
            user: req.user,
        });
    } else {
        res.status(401).json({
            message: "Not authenticated",
        });
    }
}
