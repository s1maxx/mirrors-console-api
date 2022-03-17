import {userArrayPost, userArrayUpdate, userArrayDelete, userArrayGet} from "./user.routes.js";
import {profileArrayUpdate, profileArrayDelete, profileArrayGet, profileArrayPost} from "./profile.routes.js";
import {apiArrayUpdate, apiArrayDelete, apiArrayPost, apiArrayGet} from "./api.routes.js";
import {mirrorArrayGet, mirrorArrayPost, mirrorArrayUpdate, mirrorArrayDelete} from "./mirrors.routes.js";
import {profileVideoArrayDelete, profileVideoArrayPost, profileVideoArrayUpdate, profileVideoArrayGet} from "./profile.video.routes.js";
import {profileSnapArrayGet, profileSnapArrayUpdate, profileSnapArrayDelete, profileSnapArrayPost} from "./profile.snaps.routes.js";
import {profileSettingsArrayPost, profileSettingsArrayGet, profileSettingsArrayUpdate, profileSettingsArrayDelete} from "./profile.settings.routes.js";
import {snapArrayDelete, snapArrayGet, snapArrayUpdate, snapArrayPost} from "./snaps.routes.js";

const routesArrayGet = [
    ...apiArrayGet,
    ...userArrayGet,
    ...profileArrayGet,
    ...mirrorArrayGet,
    ...profileVideoArrayGet,
    ...profileSnapArrayGet,
    ...profileSettingsArrayGet,
    ...snapArrayGet
]

const routesArrayPost = [
    ...apiArrayPost,
    ...userArrayPost,
    ...profileArrayPost,
    ...mirrorArrayPost,
    ...profileVideoArrayPost,
    ...profileSnapArrayPost,
    ...profileSettingsArrayPost,
    ...snapArrayPost
]

const routesArrayDelete = [
    ...apiArrayDelete,
    ...userArrayDelete,
    ...profileArrayDelete,
    ...mirrorArrayDelete,
    ...profileVideoArrayDelete,
    ...profileSnapArrayDelete,
    ...profileSettingsArrayDelete,
    ...snapArrayDelete
]

const routesArrayUpdate = [
    ...apiArrayUpdate,
    ...userArrayUpdate,
    ...profileSettingsArrayUpdate,
    ...profileArrayUpdate,
    ...mirrorArrayUpdate,
    ...profileVideoArrayUpdate,
    ...profileSnapArrayUpdate,
    ...snapArrayUpdate
]

export {routesArrayPost, routesArrayGet, routesArrayDelete, routesArrayUpdate};