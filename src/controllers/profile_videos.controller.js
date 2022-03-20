import ProfileVideoService from "../service/profile_video.service.js";
import ApiError from "../exceptions/api-error.js";
import {validationResult} from "express-validator";
import S3Service from "../service/s3.service.js";
import ml from 'multiparty'

class ProfileVideosController {
    async getProfileVideo(req, res, next) {
        try {
            const profile = await ProfileVideoService.getProfileVideo(req.params.id);
            if (profile.rows.length === 0)
                return next(ApiError.NotFound());

            const video = await S3Service.getFile(profile.rows[0].name);
            return video.pipe(res)
        } catch (e) {
            next(e);
        }
    }

    async getProfileVideos(req, res, next) {
        try {
            const profile = await ProfileVideoService.getProfileVideos(req.params.id);
            if (profile.rows.length === 0)
                return next(ApiError.NotFound());

            return res.json(profile.rows);
        } catch (e) {
            next(e);
        }
    }

    async getProfilesVideos(req, res, next) {
        try {
            const profile = await ProfileVideoService.getProfilesVideos();
            if (profile.rows.length === 0)
                return next(ApiError.NotFound());

            return res.json(profile.rows);
        } catch (e) {
            next(e);
        }
    }

    async addProfileVideo(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Error with create_profile-video function', errors))
            }
            const form = new ml.Form();
            form.parse(req, async (err, fields, files) => {
                    if (err)
                        throw err;
                    else {
                        if (files.length === 0)
                            return next(ApiError.BadRequest("File is not exists"));

                        console.log(fields)
                        if ((!fields.profile_id[0] || isNaN(parseInt(fields.profile_id[0]))) || !fields.description[0] || !fields.video_sequence[0] || fields.enable[0] === null || fields.nameid[0] === null || fields.nameid[0] === "")
                            return next(ApiError.BadRequest("Incorrect data!"))

                        if (files.file[0].headers["content-type"] !== "video/mp4" || !files || !files.file)
                            return next(ApiError.BadRequest("Incorrect video format!"))

                        const count = await ProfileVideoService.CountOfVideos(fields.profile_id[0]);
                        console.log(count);
                        if (count >= 5)
                            return next(ApiError.BadRequest("Max video count per profile - 5!"))


                        const video = await S3Service.upload(files.file[0]);
                        const profileVideo = await ProfileVideoService.createProfileVideo(fields, video.Location, video.Key);
                        return res.json(profileVideo.rows[0]);
                        return res.json(a);
                    }

                }
            )
        } catch (e) {
            next(e);
        }


    }

    async removeProfileVideo(req, res, next) {
        try {
            const video = await ProfileVideoService.getProfileVideo(req.params.id).then(async (result) => {
                await S3Service.removeFile(result.rows[0].name).then(async (res) => {
                    await ProfileVideoService.removeProfileVideo(req.params.id)
                })
            })

            return res.json("Success");
        } catch (e) {
            next(e);
        }
    }

    async updateProfileVideo(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Error with update_profile-video function', errors))
            }
            const form = new ml.Form();
            form.parse(req, async (err, fields, files) => {
                if (err)
                    throw err;
                else {
                    if (files.length === 0)
                        return next(ApiError.BadRequest("File is not exists"));

                    if ((!fields.profile_id[0] || isNaN(parseInt(fields.profile_id[0]))) || !fields.description[0] || !fields.video_sequence[0] || fields.enable[0] === null || fields.nameid[0] === null || fields.nameid[0] === "")
                        return next(ApiError.BadRequest("Incorrect data!"))

                    if (files?.file && files.file[0].headers["content-type"] !== "video/mp4")
                        return next(ApiError.BadRequest("Incorrect video format!"))

                    const initial = await ProfileVideoService.getPersonal(fields.id[0]).then(async (res) => {
                            if (res.profile_id !== parseInt(fields.profile_id[0]) && files?.file) {
                                const count = await ProfileVideoService.CountOfVideos(fields.profile_id[0]).then(async (res) => {
                                        if (count >= 5)
                                            return next(ApiError.BadRequest("Max video count per profile - 5!"))
                                    }
                                )
                            }
                        return res;
                        }
                    )

                    const isVideoUpdate = files?.file && initial.name !== files.file[0].originalFilename;

                    let video = null;

                    if (isVideoUpdate)
                    {
                        await S3Service.update(files.file[0], initial.name).then(async (resx) => {
                            const profileVideo = await ProfileVideoService.updateProfileVideo(fields, resx.Key, resx.Location, initial.video_sequence);
                            return res.json(profileVideo.rows[0]);
                        });
                    }
                    else
                    {
                        const profileVideo = await ProfileVideoService.updateProfileVideo(fields, initial.name, initial.file_location, initial.video_sequence);
                        return res.json(profileVideo.rows[0]);
                    }
                }
            })
        } catch (e) {
            next(e);
        }
    }
}


export default new ProfileVideosController();