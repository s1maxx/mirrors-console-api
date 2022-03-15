import {body} from "express-validator";

import SnapController from "../../controllers/snap.controller.js";
import {admin, mirror_owner} from "../../db/roles.js";
import {snaps} from "../../db/tables.js";

const snapArrayGet = [
    {path:'/snap/:id', needAuth:true, requiredRoles: [admin, mirror_owner], table:snaps, function:SnapController.getSnap, description: "return snap by ID"},
    {path:'/snaps', needAuth:true, requiredRoles:[admin, mirror_owner], table:snaps, function:SnapController.getAllSnaps, description: "return all snaps from DB"},
]

const snapArrayPost = [
    {path:'/snap/add', validate: [
            body('name', 'Invalid name'),
            body('type', 'Invalid type')
        ], needAuth:true, requiredRoles:[admin], table:snaps, function:SnapController.addSnap, description: "add snap to DB"}
]

const snapArrayDelete = [
    {path:'/snap/:id', needAuth:true, requiredRoles:[admin], table:snaps, function:SnapController.removeSnap, description: "remove snap from DB"},
]

const snapArrayUpdate = [
    {path:'/snap/:id', validate: [
            body('name', 'Invalid name'),
            body('type', 'Invalid type')
        ], needAuth:true, requiredRoles:[admin], table:snaps, function:SnapController.updateSnap, description: "update snap from DB"}
]

export {snapArrayUpdate, snapArrayPost, snapArrayDelete, snapArrayGet};