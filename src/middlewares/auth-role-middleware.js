import ApiError from "../exceptions/api-error.js";
import tokenService from "../service/token.service.js";
import apiService from "../service/api.service.js";
import {admin} from "../db/roles.js";

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

        const route = req.url.split('/');

        const id = parseInt(route[route.length - 1]);

        if (requiredTable && id && Number.isInteger(id) && userData.role !== admin) {
            const isUserHasAccess = await apiService.isUserHasAccess(userData.id, requiredTable, id);
            console.log(isUserHasAccess);
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