import db from '../db/index.js';
import ApiError from "../exceptions/api-error.js";

class UserService{
    async changePassword(newPassword, id)
    {
        const request = `Update users set password = $1 where id = $2 returning *`;

        const req = await db.query(request, [newPassword, id])

        return req;
    }
    async getUserByEmail(email)
    {
        const users = await this.getAllUsers();

        return users.rows.filter(x=>x.email === email)[0];
    }
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
        const request = `Insert into users(uuid,email,password,role,is_activated, description, zipcode) values($1, $2, $3, $4, $5, $6, $7) returning *`;

        const res = await db.query(request, [
            user.uuid,
            user.email,
            user.password,
            user.role,
            user.is_activated,
            user.description,
            user.zipcode]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
    async updateUser(updatedUser, userID)
    {
        const request = `Update users set uuid = $1, email = $2,password = $3,role = $4,is_activated = $5, description = $6, zipcode = $7 where id = $8 returning *`;

        const res = await db.query(request, [
            updatedUser.uuid,
            updatedUser.email,
            updatedUser.password,
            updatedUser.role,
            updatedUser.is_activated,
            updatedUser.description,
            updatedUser.zipcode,
            userID]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
}

export default new UserService();