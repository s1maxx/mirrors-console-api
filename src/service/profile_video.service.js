import db from '../db/index.js';
import ApiError from "../exceptions/api-error.js";

class ProfileVideoService{
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
    async removeProfileVideo(id){
        const request = `Delete from profile_videos where id = $1`;

        try{
            await this.getProfileVideo(id);
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
    async createProfileVideo(profileVideo, path, key)
    {
        const request = `Insert into profile_videos(name,profile_id,description,file_location,video_sequence,enable) values($1, $2, $3, $4, $5, $6) returning *`;

        const res = await db.query(request, [
            key,
            parseInt(profileVideo.profile_id[0]),
            profileVideo.description[0],
            path,
            profileVideo.video_sequence[0],
            profileVideo.enable[0]]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
    async updateProfileVideo(updateProfileV, profileVID)
    {
        const request = `Update profile_videos set description = $1, profile_id = $2, video_sequence = $3, enable = $4 where id = $5 returning *`;

        const res = await db.query(request, [
            updateProfileV.description,
            updateProfileV.profile_id,
            updateProfileV.video_sequence,
            updateProfileV.enable,
            profileVID]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
}

export default new ProfileVideoService();