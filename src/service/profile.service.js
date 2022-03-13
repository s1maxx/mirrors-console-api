import db from '../db/index.js';
import ApiError from "../exceptions/api-error.js";

class ProfileService{
    async getAllProfiles(){
        const request = "Select * from profiles Order by id";
        const res = await db.query(request);
        if(res.rowCount === 0)
            throw ApiError.NotFound();
        return res;
    }
    async getProfile(id){
        const request = `Select * from profiles where id = $1`;

        const res = await db.query(request, [id]);
        if(res.rowCount === 0)
            throw ApiError.NotFound();
        return res;
    }
    async removeProfile(id){
        const request = `Delete from profiles where id = $1`;

        try{
            await this.getProfile(id);
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
    async createProfile(profile)
    {
        const request = `Insert into profiles(name,description,profile_owner,version) values($1, $2, $3, $4) returning *`;

        const res = await db.query(request, [
            profile.name,
            profile.description,
            profile.profile_owner,
            profile.version]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
    async updateProfile(updateProfile, profileID)
    {
        const request = `Update profiles set name = $1, description = $2, profile_owner = $3, version = $4 where id = $5 returning *`;

        const res = await db.query(request, [
            updateProfile.name,
            updateProfile.description,
            updateProfile.profile_owner,
            updateProfile.version,
            profileID]);

        if(res.rowCount === 0)
            throw ApiError.ServerException();
        return res;
    }
}

export default new ProfileService();