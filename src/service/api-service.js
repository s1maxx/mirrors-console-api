import db from '../db/index.js';
import ApiError from "../exceptions/api-error.js";

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
}

export default new ApiService();