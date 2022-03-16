import db from '../db/index.js';
import ApiError from "../exceptions/api-error.js";

class ProfileSnapsService{
    async getProfileSnap(id){
        const request = `Select * from profile_snaps where uuid = $1`;

        const res = await db.query(request, [id]);
        if(res.rowCount === 0)
            throw ApiError.NotFound();
        return res;
    }
    async removeProfileSnap(id){
        const request = `Delete from profile_snaps where id = $1`;

        try{
            await this.getProfileSnap(id);
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
    async createProfileSnap(profileVideo)
    {
        const request = `Insert into profile_snaps(uuid,profile_id,snap_id,value,enable) values($1, $2, $3, $4, $5) returning *`;

        const res = await db.query(request, [
            profileVideo.uuid,
            profileVideo.profile_id,
            profileVideo.snap_id,
            profileVideo.value,
            profileVideo.enable]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
    async updateProfileSnap(updateProfileSnap, profileSID)
    {
        const request = `Update profile_snaps set uuid = $1, value = $2, profile_id = $3, snap_id = $4, enable = $5 where id = $6 returning *`;

        const res = await db.query(request, [
            updateProfileSnap.uuid,
            updateProfileSnap.value,
            updateProfileSnap.profile_id,
            updateProfileSnap.snap_id,
            updateProfileSnap.enable,
            profileSID]);

        console.log(res)

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
}

export default new ProfileSnapsService();