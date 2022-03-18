import {body} from "express-validator";

import profileVideoController from "../../controllers/profile_videos.controller.js";
import {admin, mirror_owner} from "../../db/roles.js";
import {profile_videos} from "../../db/tables.js";

const profileVideoArrayGet = [
    {path:'/profile/video/:id', requiredRoles:[admin, mirror_owner], table:profile_videos, needAuth:true, function:profileVideoController.getProfileVideo, description: "return profile video by ID"},
    {path:'/profile/videos/:id', requiredRoles:[admin, mirror_owner], table:profile_videos, needAuth:true, function:profileVideoController.getProfileVideos, description: "return profile video array by user ID"},
]

const profileVideoArrayPost = [
    {path:'/profile/video/add', validate: [
        body('file', 'Invalid file').notEmpty(),
            body('description', 'Invalid description'),
            body('video_sequence', 'Invalid video sequence'),
            body('profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('enable', 'Invalid boolean').isBoolean()
        ], needAuth:true, requiredRoles:[admin, mirror_owner], table:profile_videos, function:profileVideoController.addProfileVideo, description: "add profile video to DB"}
]

const profileVideoArrayDelete = [
    {path:'/profile/video/:id', needAuth:true, requiredRoles:[admin, mirror_owner], table:profile_videos, function:profileVideoController.removeProfileVideo, description: "remove profile video from DB"},
]

const profileVideoArrayUpdate = [
    {path:'/profile/video/:id', validate: [
            body('description', 'Invalid description'),
            body('video_sequence', 'Invalid video sequence'),
            body('profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('enable', 'Invalid boolean').isBoolean(),
            body('nameId', "Invalid nameId").notEmpty()
        ], needAuth:true, requiredRoles:[admin, mirror_owner], table:profile_videos, function:profileVideoController.updateProfileVideo, description: "update profile video from DB"}
]

export {profileVideoArrayUpdate, profileVideoArrayPost, profileVideoArrayDelete, profileVideoArrayGet};