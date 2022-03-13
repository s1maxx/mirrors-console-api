import jwt from "jsonwebtoken";
import db from '../db/index.js';
import ApiError from "../exceptions/api-error.js";

class TokenService {
    async generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_KEY, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {expiresIn: '20d'})
        return{
            accessToken, refreshToken
        }
    }

    async saveToken(userID, refreshToken){
        const tokenData = await db.query("Select * from tokens where user_id = $1", [userID]);
        if(tokenData.rowCount > 0)
        {
            tokenData.rows[0].token = refreshToken;

            const returned = await db.query("Update tokens set token = $1 where user_id = $2 returning *", [refreshToken, userID])
            return returned.rows[0];
        }

        const token = await db.query("Insert into tokens(user_id, token) values($1, $2) returning *", [userID, refreshToken]);
        return token.rows[0];
    }

    async removeToken(refreshToken)
    {
        const tokenData = await db.query("Delete from tokens where token = $1 returning *", [refreshToken]);
        return tokenData;
    }

    validateTokenAccess(token)
    {
        try{
        const userData = jwt.verify(token, process.env.JWT_KEY);
        return userData;
        }catch (e)
        {
            return null;
        }
    }

    validateTokenRefresh(token)
    {
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_KEY);
            return userData;
        }catch (e)
        {
            return null;
        }
    }
    async findToken(refreshToken){
        const tokenData = await db.query("Select * from tokens where token = $1", [refreshToken]);
        return tokenData;
    }
}

export default new TokenService();