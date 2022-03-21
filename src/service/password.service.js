import db from '../db/index.js';
import ApiError from "../exceptions/api-error.js";
import {passwords} from "../db/tables.js";
import userService from "./user.service.js";

class PasswordService{

    async validateUUid(uuid)
    {
        const request = "Select * from passwords where uuid_refresh = $1";

        const result = await db.query(request, [uuid])

        return result?.rows[0];
    }

    async CompareUuid(email, uuid)
    {
        const request = "Select m.* from passwords as m join users as u on userid = u.id where email = $1 and uuid_refresh = $2";

        const result = await db.query(request, [email, uuid])

        return result.rowCount > 0 ? true : false;
    }

    async pushPassword(passwordBody)
    {
        const request = "Insert into passwords (userid, uuid_refresh) values($1, $2) returning *"

        const result = await db.query(request, [passwordBody.userid, passwordBody.uuid_refresh])

        return result.rows[0];
    }

    async isExists(email)
    {
        const user = await userService.getUserByEmail(email);

        if(!user)
            return false;

        const request = `Select m.* from passwords as m join users as u on userid = u.id where u.id = $1`;

        const result = await db.query(request, [user.id])

        return result.rowCount > 0 ? true : false;
    }

    async removePassword(id)
    {
        const request = "Delete from passwords where userid = $1 returning *"

        const result = await db.query(request, [id])

        return result.rowCount > 0 ? true : false;
    }

}

export default new PasswordService();