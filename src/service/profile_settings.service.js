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
    async getProfileSettingsArray(id){
        const request = `Select * from profile_settings where profile_id = $1`;
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
    async removeProfileSettingsArr(id){
        if(!body)
            throw ApiError.BadRequest("Invalid body request!")

        try{
            const ids = JSON.parse(body);

            const request = `Delete from profile_settings where id in (${ids.join(',')})`;

            const res = await db.query(request);

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
        const first = []; const second = []; const third = [];

        for (const [key, value] of Object.entries(profileSettings)) {
            let x = value;
            for (const [key, value] of Object.entries(x)) {
                if(key === "profile_id")
                    first.push(parseInt(value))
                else if(key === "name") second.push(`'${value}'`)
                else if(key === "enable") third.push(value);
            }
        }

        let request = `Insert into profile_settings(profile_id,name,enable) select * from unnest(array[${[...first]}], array[${[...second]}], array[${[...third]}]) returning *`;

        const res = await db.query(request);

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