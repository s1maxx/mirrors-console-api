import {body} from "express-validator";

import profileSnapController from "../../controllers/profile_snaps.controller.js";
import {admin, mirror_owner} from "../../db/roles.js";
import {profile_snaps} from "../../db/tables.js";

const profileSnapArrayGet = [
    {path:'/profile/snap/:id', needAuth:true, requiredRoles:[admin], table:profile_snaps, function:profileSnapController.getProfileSnap, description: "return profile snap by ID"},
]

const profileSnapArrayPost = [
    {path:'/profile/snap/add', validate: [
            body('uuid', 'Invalid uuid'),
            body('value', 'Invalid value'),
            body('snap_id', 'Invalid snap id').notEmpty().isNumeric(),
            body('profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('enable', 'Invalid boolean').isBoolean()
        ], needAuth:true, requiredRoles:[admin], table:profile_snaps, function:profileSnapController.addProfileSnap, description: "add profile snap to DB"},
    {path:'/profile/snaps/add', validate: [
        body().isArray(),
            body('*.uuid', 'Invalid uuid'),
            body('*.value', 'Invalid value'),
            body('*.snap_id', 'Invalid snap id').notEmpty().isNumeric(),
            body('*.profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('*.enable', 'Invalid boolean').isBoolean()
        ], needAuth:true, requiredRoles:[admin], table:profile_snaps, function:profileSnapController.addProfileSnaps, description: "add profile array snap to DB"}
]

const profileSnapArrayDelete = [
    {path:'/profile/snap/:id', needAuth:true, requiredRoles:[admin], table:profile_snaps, function:profileSnapController.removeProfileSnap, description: "remove profile snap from DB"},
]

const profileSnapArrayUpdate = [
    {path:'/profile/snap/:id', validate: [
            body('uuid', 'Invalid uuid'),
            body('value', 'Invalid value'),
            body('snap_id', 'Invalid snap id').notEmpty().isNumeric(),
            body('profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('enable', 'Invalid boolean').isBoolean()
        ], needAuth:true, requiredRoles:[admin], table:profile_snaps, function:profileSnapController.updateProfileSnap, description: "update profile snap from DB"},
    {path:'/profile/snaps/:id', validate: [
            body().isArray(),
            body('*.uuid', 'Invalid uuid'),
            body('*.value', 'Invalid value'),
            body('*.snap_id', 'Invalid snap id').notEmpty().isNumeric(),
            body('*.profile_id', 'Invalid profile id').notEmpty().isNumeric(),
            body('*.enable', 'Invalid boolean').isBoolean()
        ], needAuth:true, requiredRoles:[admin], table:profile_snaps, function:profileSnapController.updateProfileSnaps, description: "update array snap to DB"}
]

export {profileSnapArrayUpdate, profileSnapArrayPost, profileSnapArrayDelete, profileSnapArrayGet};