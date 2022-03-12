import db from '../db/index.js';
import ApiError from "../exceptions/api-error.js";

class UserService{
    async getAllUsers(){
        const request = "Select * from users Order by id";
        const res = await db.query(request);
        if(res.rowCount === 0)
            throw ApiError.NotFound();
        return res;
    }
    async getUser(id){
        const request = `Select * from users where id = $1`;

        const res = await db.query(request, [id]);
        if(res.rowCount === 0)
            throw ApiError.NotFound();
        return res;
    }
    async removeUser(id){
        const request = `Delete from users where id = $1`;

        try{
            await this.getUser(id);
            const res = await db.query(request, [id]);

            if(res.rowCount === 0)
                throw ApiError.ServerException();
            return res;
        }
        catch (e)
        {
            throw e;
        }
    }
    async createUser(user)
    {
        const request = `Insert into users(uuid,email,password,role,is_activated) values($1, $2, $3, $4, $5) returning *`;

        const res = await db.query(request, [
            user.uuid,
            user.email,
            user.password,
            user.role,
            user.is_activated]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
    async updateUser(updatedUser, userID)
    {
        const request = `Update users set  uuid = $1, email = $2,password = $3,role = $4,is_activated = $5 where id = $6 returning *`;

        const res = await db.query(request, [
            updatedUser.uuid,
            updatedUser.email,
            updatedUser.password,
            updatedUser.role,
            updatedUser.is_activated,
            userID]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
}

export default new UserService();