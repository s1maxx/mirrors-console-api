import db from '../db/index.js';
import ApiError from "../exceptions/api-error.js";

class SnapsService{
    async getAllSnaps()
    {
        const request = `Select * from snaps Order by id`;

        const res = await db.query(request);
        if(res.rowCount === 0)
            throw ApiError.NotFound();
        return res;
    }
    async getSnap(id){
        const request = `Select * from snaps where id = $1`;

        const res = await db.query(request, [id]);
        if(res.rowCount === 0)
            throw ApiError.NotFound();
        return res;
    }
    async removeSnap(id){
        const request = `Delete from snaps where id = $1`;

        try{
            await this.getSnap(id);
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
    async createSnap(snap)
    {
        const request = `Insert into snaps(name,type) values($1, $2) returning *`;

        const res = await db.query(request, [
            snap.name,
            snap.type]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
    async updateSnap(updateSnap, snapID)
    {
        const request = `Update snaps set name = $1, type = $2 where id = $3 returning *`;

        const res = await db.query(request, [
            updateSnap.name,
            updateSnap.type,
            snapID]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
}

export default new SnapsService();