import ApiError from "../exceptions/api-error.js";
import tokenService from "../service/token.service.js";
import apiService from "../service/api.service.js";
import {admin} from "../db/roles.js";
import {mirrors, profiles, users} from "../db/tables.js";

export default async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        const accessToken = authorizationHeader.split(' ')[1];
        const userData = tokenService.validateTokenAccess(accessToken);

        const requiredRoles = req?.requiredRoles;
        const requiredTable = req?.table;

        if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(userData.role) && userData.role !== admin) {
            return next(ApiError.UnavaliableData())
        }

        const id = req?.params?.id;

        // const isGetAll = req.method ==="GET" && mainRoutes.includes(routePath);

        const splited = req.url.split('/');

        if (requiredTable && id && id && userData.role !== admin) {
            const isUserHasAccess = await apiService.isUserHasAccess(userData.id, requiredTable, id, splited[splited.length - 2] === mirrors ? mirrors : "");
            if (!isUserHasAccess)
                return next(ApiError.UnavaliableData())
        }

        req.user = userData;
        next();
    } catch (e) {
        console.log(e)
        return next(ApiError.UnavaliableData())
    }
}