import db from '../db/index.js';
import ApiError from "../exceptions/api-error.js";
import bcrypt from "bcrypt";
import AdminDto from "../dtos/adminModel.js";
import TokenService from "./token.service.js"
import tokenService from "./token.service.js";
import UserDto from "../dtos/adminModel.js";

class ApiService{
    async getAllTables(){
        const request = "SELECT * FROM information_schema.tables WHERE table_schema = 'public'";
        const res = await db.query(request);
        if(res.rowCount === 0)
            throw ApiError.NotFound();
        return [...res.rows.map(content=>{
            return content["table_name"];
        })];
    }

    async getTable(name)
    {
        const request = "SELECT * FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1";
        const res = await db.query(request, [name]);
        if(res.rowCount === 0)
            throw ApiError.NotFound();
        return res;
    }

    async login(username, email = "", password)
    {
        console.log("username: ", username, "email: ", email, "password: ", password);
        const searchItem = email !== "" ? "email" : "uuid";
        const user = await db.query(`Select * from users where ${searchItem} = $1`, [email !== "" ? email : username]);
        if(user.rowCount === 0)
        {
            throw ApiError.BadRequest(`User with ${searchItem} - ${username} not found`);
        }

        const isPassEquals = password === user.rows[0].password;
        if(!isPassEquals)
        {
            throw ApiError.BadRequest(`Invalid password`);
        }

        const userDto = new UserDto(user.rows[0]);
        const tokens = await TokenService.generateTokens({...userDto});

        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        console.log(userDto)
        return {...tokens, user: userDto};
    }

    async isUserHasAccess(userID, table, objectID)
    {
        const user = await db.query(`Select * from ${table} where id = $1 and profile_id = $2`, [objectID, userID]);
        // console.log(user)
        if(user.rowCount === 0)
        {
            return null;
        }
        return user;
    }

    async logout(refreshToken)
    {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken)
    {
        if(!refreshToken)
        {
            throw ApiError.UnavaliableData();
        }

        const userData = tokenService.validateTokenRefresh(refreshToken);
        const tokenFromDB = tokenService.findToken(refreshToken);

        if(!userData || tokenFromDB.rowCount === 0)
        {
            throw ApiError.UnavaliableData();
        }

        const user =  await db.query('Select * from admins where id = $1', [userData.id]);
        const adminDto = new AdminDto(user.rows[0]);
        const tokens = await tokenService.generateTokens({...adminDto});

        await tokenService.saveToken(adminDto.id, tokens.refreshToken);
        return {...tokens, admin: adminDto};
    }
}

export default new ApiService();