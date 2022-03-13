import {body} from "express-validator";

import profileSnapController from "../../controllers/profile_snaps.controller.js";

const profileSnapArrayGet = [
    {path:'/profile/snap/:id', needAuth:true, function:profileSnapController.getProfileSnap, description: "return profile snap by ID"},
]

const profileSnapArrayPost = [
    {path:'/profile/snap/add', validate: [
            body('uuid', 'Invalid uuid'),
            body('value', 'Invalid value'),
            body('snap_id', 'Invalid snap id').notEmpty().isNumeric(),
            body('profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('enable', 'Invalid boolean').isBoolean()
        ], needAuth:true, function:profileSnapController.addProfileSnap, description: "add profile snap to DB"}
]

const profileSnapArrayDelete = [
    {path:'/profile/snap/:id', needAuth:true, function:profileSnapController.removeProfileSnap, description: "remove profile snap from DB"},
]

const profileSnapArrayUpdate = [
    {path:'/profile/snap/:id', validate: [
            body('uuid', 'Invalid uuid'),
            body('value', 'Invalid value'),
            body('snap_id', 'Invalid snap id').notEmpty().isNumeric(),
            body('profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('enable', 'Invalid boolean').isBoolean()
        ], needAuth:true, function:profileSnapController.updateProfileSnap, description: "update profile snap from DB"}
]

export {profileSnapArrayUpdate, profileSnapArrayPost, profileSnapArrayDelete, profileSnapArrayGet};