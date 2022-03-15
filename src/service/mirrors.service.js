import db from '../db/index.js';
import ApiError from "../exceptions/api-error.js";

class MirrorsService{
    async getAllMirrors(id){
        const whereState = id ? `where profile_id = ${id}` : ""
        const request = `Select * from mirrors ${whereState} Order by id`;
        const res = await db.query(request);
        if(res.rowCount === 0)
            throw ApiError.NotFound();
        return res;
    }
    async getMirror(id){
        const request = `Select * from mirrors where id = $1`;

        const res = await db.query(request, [id]);
        if(res.rowCount === 0)
            throw ApiError.NotFound();
        return res;
    }
    async removeMirror(id){
        const request = `Delete from mirrors where id = $1`;

        try{
            await this.getMirror(id);
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
    async createMirror(mirror)
    {
        const request = `Insert into mirrors(uuid,name,description,profile_id,teamviewer_id) values($1, $2, $3, $4, $5) returning *`;

        const res = await db.query(request, [
            mirror.uuid,
            mirror.name,
            mirror.description,
            mirror.profile_id,
            mirror.teamviewer_id]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
    async updateMirror(updateMirror, mirrorID)
    {
        const request = `Update mirrors set uuid = $1, name = $2, description = $3, profile_id = $4, teamviewer_id = $5 where id = $6 returning *`;

        const res = await db.query(request, [
            updateMirror.uuid,
            updateMirror.name,
            updateMirror.description,
            updateMirror.profile_id,
            updateMirror.teamviewer_id,
            mirrorID]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
}

export default new MirrorsService();