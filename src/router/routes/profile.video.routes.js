import {body} from "express-validator";

import profileVideoController from "../../controllers/profile_videos.controller.js";

const profileVideoArrayGet = [
    {path:'/profile/video/:id', needAuth:true, function:profileVideoController.getProfileVideo, description: "return profile video by ID"},
]

const profileVideoArrayPost = [
    {path:'/profile/video/add', validate: [
            body('name', 'Invalid name'),
            body('description', 'Invalid description'),
            body('file_location', 'Invalid file location'),
            body('video_sequence', 'Invalid video sequence'),
            body('profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('enable', 'Invalid boolean').isBoolean()
        ], needAuth:true, function:profileVideoController.addProfileVideo, description: "add profile video to DB"}
]

const profileVideoArrayDelete = [
    {path:'/profile/video/:id', needAuth:true, function:profileVideoController.removeProfileVideo, description: "remove profile video from DB"},
]

const profileVideoArrayUpdate = [
    {path:'/profile/video/:id', validate: [
            body('name', 'Invalid name'),
            body('description', 'Invalid description'),
            body('file_location', 'Invalid file location'),
            body('video_sequence', 'Invalid video sequence'),
            body('profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('enable', 'Invalid boolean').isBoolean()
        ], needAuth:true, function:profileVideoController.updateProfileVideo, description: "update profile video from DB"}
]

export {profileVideoArrayUpdate, profileVideoArrayPost, profileVideoArrayDelete, profileVideoArrayGet};