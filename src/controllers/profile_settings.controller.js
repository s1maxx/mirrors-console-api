import ProfileSettingsService from "../service/profile_settings.service.js";
import ApiError from "../exceptions/api-error.js";
import {validationResult} from "express-validator";

class ProfileSettingsController {
    async getProfileSettings(req,res,next){
        try{
            const profile = await ProfileSettingsService.getProfileSettings(req.params.id);
            return res.json(profile.rows[0]);
        }catch (e)
        {
            next(e);
        }
    }
    async getProfileSettingsArray(req,res,next){
        try{
            const profile = await ProfileSettingsService.getProfileSettingsArray(req.params.id);
            return res.json(profile.rows);
        }catch (e)
        {
            next(e);
        }
    }
    async addProfileSettings(req,res,next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with create_settings function', errors))
            }
            const profileSettings = await ProfileSettingsService.createProfileSettings(req.body);
            return res.json(profileSettings.rows[0]);
        }catch (e)
        {
            next(e);
        }
    }
    async addProfileSettingsArray(req,res,next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with create_array-settings function', errors))
            }
            const profileSettings = await ProfileSettingsService.createProfileSettings(req.body);

            return res.json(profileSettings.rows);
        }catch (e)
        {
            next(e);
        }
    }
    async removeProfileSettings(req,res,next){
        try{
            await ProfileSettingsService.removeProfileSettings(req.params.id);
            return res.json();
        }catch (e)
        {
            next(e);
        }
    }
    async updateProfileSettings(req, res, next){
        try{
            console.log(req)
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with update_settings function', errors))
            }
            const updatedProfileSettings = await ProfileSettingsService.updateProfileSettings(req.body, req.params.id);
            return res.json(updatedProfileSettings.rows[0])
        }catch (e)
        {
            next(e);
        }
    }
    async updateProfileSettingsArray(req,res,next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with update_array-settings function', errors))
            }
            const result = [];
            for (let i = 0; i < req.body.length; i++)
            {
                const profileSettings = await ProfileSettingsService.updateProfileSettings(req.body[i], req.body[i].id);
                result.push(profileSettings.rows);
            }
            return res.json(result);
        }catch (e)
        {
            next(e);
        }
    }
}


export default new ProfileSettingsController();