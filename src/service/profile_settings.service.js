import db from '../db/index.js';
import ApiError from "../exceptions/api-error.js";

class ProfileSettingsService{
    async getProfileSettings(id){
        const request = `Select * from profile_settings where id = $1`;
        const res = await db.query(request, [id]);
        if(res.rowCount === 0)
            throw ApiError.NotFound();
        return res;
    }
    async removeProfileSettings(id){
        const request = `Delete from profile_settings where id = $1`;

        try{
            await this.getProfileSettings(id);
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
    async createProfileSettings(profileSettings)
    {
        const request = `Insert into profile_settings(profile_id,name,enable) values($1, $2, $3) returning *`;

        const res = await db.query(request, [
            profileSettings.profile_id,
            profileSettings.name,
            profileSettings.enable]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
    async updateProfileSettings(updateProfileSettings, profileSID)
    {
        const request = `Update profile_settings set profile_id = $1, name = $2, enable = $3 where id = $4 returning *`;

        const res = await db.query(request, [
            updateProfileSettings.profile_id,
            updateProfileSettings.name,
            updateProfileSettings.enable,
            profileSID]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
}

export default new ProfileSettingsService();