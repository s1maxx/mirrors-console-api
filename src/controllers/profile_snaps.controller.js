import ProfileSnapService from "../service/profile_snaps.service.js";
import ApiError from "../exceptions/api-error.js";
import {validationResult} from "express-validator";

class ProfileSnapsController {
    async getProfileSnap(req,res,next){
        try{
            const profile = await ProfileSnapService.getProfileSnap(req.params.id);
            return res.json(profile.rows);
        }catch (e)
        {
            next(e);
        }
    }
    async addProfileSnap(req,res,next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with create_profile-snap function', errors))
            }
            const profileSnap = await ProfileSnapService.createProfileSnap(req.body);
            return res.json(profileSnap.rows[0]);
        }catch (e)
        {
            next(e);
        }
    }
    async removeProfileSnap(req,res,next){
        try{
            await ProfileSnapService.removeProfileSnap(req.params.id);
            return res.json();
        }catch (e)
        {
            next(e);
        }
    }
    async updateProfileSnap(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with update_profile-snap function', errors))
            }
            const updatedProfileSnap = await ProfileSnapService.updateProfileSnap(req.body, req.params.id);
            return res.json(updatedProfileSnap.rows[0])
        }catch (e)
        {
            next(e);
        }
    }
}


export default new ProfileSnapsController();