import db from '../db/index.js';
import ApiError from "../exceptions/api-error.js";
import bcrypt from "bcrypt";
import AdminDto from "../dtos/adminModel.js";
import TokenService from "./token.service.js"
import tokenService from "./token.service.js";

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

    async login(username, password)
    {
        const user = await db.query("Select * from admins where name = $1", [username]);
        if(user.rowCount === 0)
        {
            throw ApiError.BadRequest(`User with name - ${username} not found`);
        }

        console.log(await bcrypt.hash(password, 5));
        const isPassEquals = await bcrypt.compare(password, user.rows[0].password);
        if(!isPassEquals)
        {
            throw ApiError.BadRequest(`Invalid password`);
        }

        const adminDto = new AdminDto(user.rows[0]);
        const tokens = await TokenService.generateTokens({...adminDto});

        await TokenService.saveToken(adminDto.id, tokens.refreshToken);

        return {...tokens, admin: adminDto};
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