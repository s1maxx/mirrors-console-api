import ProfileVideoService from "../service/profile_video.service.js";
import ApiError from "../exceptions/api-error.js";
import {validationResult} from "express-validator";
import S3Service from "../service/s3.service.js";
import ml from'multiparty'
import {Readable} from "stream";
import * as Stream from "stream";

class ProfileVideosController {
    async getProfileVideo(req,res,next){
        try{
            const profile = await ProfileVideoService.getProfileVideo(req.params.id);
            if(profile.rows.length === 0)
                return next(ApiError.NotFound());

            const video = await S3Service.getFile(profile.rows[0].name);
            return video.pipe(res)
        }catch (e)
        {
            next(e);
        }
    }
    async getProfileVideos(req,res,next){
        try{
            const profile = await ProfileVideoService.getProfileVideos(req.params.id);
            if(profile.rows.length === 0)
                return next(ApiError.NotFound());

            return res.json(profile.rows);
        }catch (e)
        {
            next(e);
        }
    }
    async getProfilesVideos(req,res,next){
        try{
            const profile = await ProfileVideoService.getProfilesVideos();
            if(profile.rows.length === 0)
                return next(ApiError.NotFound());

            return res.json(profile.rows);
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
            const form = new ml.Form();
            form.parse(req, async (err, fields, files) => {
                    if(err)
                        throw err;
                    else
                    {
                        if(files.length === 0)
                            return next(ApiError.BadRequest("File is not exists"));

                        console.log(fields)
                        if((!fields.profile_id[0] || isNaN(parseInt(fields.profile_id[0]))) || !fields.description[0] || !fields.video_sequence[0] || fields.enable[0] === null || fields.nameid[0] === null || fields.nameid[0] === "" )
                            return  next(ApiError.BadRequest("Incorrect data!"))

                        if(files.file[0].headers["content-type"] !== "video/mp4" || !files || !files.file)
                            return  next(ApiError.BadRequest("Incorrect video format!"))

                        const video = await S3Service.upload(files.file[0]);
                        const profileVideo = await ProfileVideoService.createProfileVideo(fields, video.Location, video.Key);
                        return res.json(profileVideo.rows[0]);
                    }
                }
            )
        }catch (e)
        {
            next(e);
        }


    }
    async removeProfileVideo(req,res,next){
        try{
            const video = await ProfileVideoService.getProfileVideo(req.params.id).then(async (result) => {
                await ProfileVideoService.removeProfileVideo(req.params.id);
                await S3Service.removeFile(result.rows[0].name);
            })

            return res.json("Success");
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