import ProfileVideoService from "../service/profile_video.service.js";
import ApiError from "../exceptions/api-error.js";
import {validationResult} from "express-validator";

class ProfileVideosController {
    async getProfileVideo(req,res,next){
        try{
            const profile = await ProfileVideoService.getProfileVideo(req.params.id);
            return res.json(profile.rows[0]);
        }catch (e)
        {
            next(e);
        }
    }
    async addProfileVideo(req,res,next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with create_profile-video function', errors))
            }
            const profileVideo = await ProfileVideoService.createProfileVideo(req.body);
            return res.json(profileVideo.rows[0]);
        }catch (e)
        {
            next(e);
        }
    }
    async removeProfileVideo(req,res,next){
        try{
            await ProfileVideoService.removeProfileVideo(req.params.id);
            return res.json();
        }catch (e)
        {
            next(e);
        }
    }
    async updateProfileVideo(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                return next(ApiError.BadRequest('Error with update_profile-video function', errors))
            }
            const updatedProfileVideo = await ProfileVideoService.updateProfileVideo(req.body, req.params.id);
            return res.json(updatedProfileVideo.rows[0])
        }catch (e)
        {
            next(e);
        }
    }
}


export default new ProfileVideosController();