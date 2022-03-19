import db from '../db/index.js';
import ApiError from "../exceptions/api-error.js";

class ProfileVideoService{

    async isIndexExists(id, index){
        const request = `Select id from profile_videos where profile_id = $1 and video_sequence = $2`

        const res = await db.query(request, [id, index]);
        if(res.rows !== 0)
            return true;
        else return false;
    }

    async ReIndex(index, id, isDelete = false, old = -1)
    {
        let where = ""
        let symbol = ""
        if(old === -1 && isDelete)
        {
            where = `where profile_id = $1 and video_sequence > $2`;
            symbol = "-";
        }
        if(old === -1 && !isDelete)
        {
            where = `where profile_id = $1 and video_sequence >= $2`;
            symbol = "+";
        }
        else if(old !== -1 && old < index)
        {
            where = `where profile_id = $1 and video_sequence > ${old} and video_sequence <= $2`
            symbol = "-";
        }
        else if(old !== -1 && old > index)
        {
            where = `where profile_id = $1 and video_sequence >= $2 and video_sequence < ${old}`;
            symbol = "+"
        }
        else if(old === index)
        {
            return true;
        }

        const requestUpd = `Update profile_videos set video_sequence = video_sequence ${symbol} 1 ${where} returning *`;

        const res = await db.query(requestUpd, [id, index]);
        if(res.rowCount > 0 || (res.rowCount === 0 && index === 1))
            return res;
    }

    async CountOfVideos(id){
        const request = `Select * from profile_videos where profile_id = $1`;

        const res = await db.query(request, [id]);
        return res.rowCount;
    }

    async getProfileVideo(id){
        const request = `Select * from profile_videos where id = $1`;

        const res = await db.query(request, [id]);
        if(res.rowCount === 0)
            throw ApiError.NotFound();
        return res;
    }
    async getProfileVideos(id){
        const request = `Select m.* from profile_videos as m join profiles as p on profile_id = p.id where profile_owner = $1`;

        const res = await db.query(request, [id]);

        if(res.rowCount === 0)
            throw ApiError.NotFound();
        return res;
    }
    async getProfilesVideos(){
        const request = `Select * from profile_videos Order by id`;

        const res = await db.query(request);

        if(res.rowCount === 0)
            throw ApiError.NotFound();
        return res;
    }
    async removeProfileVideo(id){
        const request = `Delete from profile_videos where id = $1`;

        try{
            const video = await this.getProfileVideo(id);
            const res = await db.query(request, [id]);
            const reindex = await this.ReIndex(video.rows[0].video_sequence, video.rows[0].profile_id, true);

            if(res.rowCount === 0)
                throw ApiError.ServerException();
            return res;
        }
        catch (e)
        {
            throw e;
        }
    }
    async createProfileVideo(profileVideo, path, key)
    {
        const request = `Insert into profile_videos(name,profile_id,description,file_location,video_sequence,enable, nameid) values($1, $2, $3, $4, $5, $6, $7) returning *`;

        if(this.isIndexExists(profileVideo.video_sequence[0]))
            await this.ReIndex(parseInt(profileVideo.video_sequence[0]), parseInt(profileVideo.profile_id[0]));

        const res = await db.query(request, [
            key,
            parseInt(profileVideo.profile_id[0]),
            profileVideo.description[0],
            path,
            parseInt(profileVideo.video_sequence[0]),
            profileVideo.enable[0],
            profileVideo.nameid[0]]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
    async updateProfileVideo(updateProfileV, profileVID)
    {
        const getOld = await this.getProfileVideo(profileVID);

        const request = `Update profile_videos set description = $1, profile_id = $2, video_sequence = $3, enable = $4, nameid = $5 where id = $6 returning *`;

        const reindex = await this.ReIndex(parseInt(updateProfileV.video_sequence), parseInt(updateProfileV.profile_id), false, getOld.rows[0].video_sequence);

        const res = await db.query(request, [
            updateProfileV.description,
            updateProfileV.profile_id,
            updateProfileV.video_sequence,
            updateProfileV.enable,
            updateProfileV.nameid,
            profileVID]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
}

export default new ProfileVideoService();