import ProfileService from "../service/profile.service.js";
import ApiError from "../exceptions/api-error.js";
import {validationResult} from "express-validator";

class ProfileController {
    async getProfiles(req, res, next) {
        try {
            const profiles = await ProfileService.getAllProfiles(req.params.id);
            return res.json(profiles.rows);
        } catch (e) {
            next(e);
        }
    }
    async getProfile(req,res,next){
        try{
            const profile = await ProfileService.getProfile(req.params.id);
            return res.json(profile.rows[0]);
        }catch (e)
        {
            next(e);
        }
    }
    async getProfileMirrors(req,res,next){
        try{
            const profile = await ProfileService.getProfileMirrors(req.params.id);
            return res.json(profile.rows);
        }catch (e)
        {
            next(e);
        }
    }
    async addProfile(req,res,next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with create_profile function', errors))
            }
            const profile = await ProfileService.createProfile(req.body);
            return res.json(profile.rows[0]);
        }catch (e)
        {
            next(e);
        }
    }
    async removeProfile(req,res,next){
        try{
            await ProfileService.removeProfile(req.params.id);
            return res.json();
        }catch (e)
        {
            next(e);
        }
    }
    async updateProfile(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with update_profile function', errors))
            }
            const updatedProfile = await ProfileService.updateProfile(req.body, req.params.id);
            return res.json(updatedProfile.rows[0])
        }catch (e)
        {
            next(e);
        }
    }
}


export default new ProfileController();