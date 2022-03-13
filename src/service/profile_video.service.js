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
    async createProfileVideo(profileVideo)
    {
        const request = `Insert into profile_videos(name,profile_id,description,file_location,video_sequence,enable) values($1, $2, $3, $4, $5, $6) returning *`;

        const res = await db.query(request, [
            profileVideo.name,
            profileVideo.profile_id,
            profileVideo.description,
            profileVideo.file_location,
            profileVideo.video_sequence,
            profileVideo.enable]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
    async updateProfileVideo(updateProfileV, profileVID)
    {
        const request = `Update profile_videos set name = $1, description = $2, profile_id = $3, file_location = $4, video_sequence = $5, enable = $6 where id = $7 returning *`;

        const res = await db.query(request, [
            updateProfileV.name,
            updateProfileV.description,
            updateProfileV.profile_id,
            updateProfileV.file_location,
            updateProfileV.video_sequence,
            updateProfileV.enable,
            profileVID]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
}

export default new ProfileVideoService();