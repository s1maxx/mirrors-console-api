import ApiError from "../exceptions/api-error.js";
import tokenService from "../service/token.service.js";
import UserService from "../service/user.service.js";

export default async function (req, res, next){
    try{
        const authorizationHeader = req.headers.authorization;

        if(!authorizationHeader)
        {
            return next(ApiError.UnavaliableData())
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if(!accessToken)
        {

            return next(ApiError.UnavaliableData())
        }

        const userData = await tokenService.validateTokenAccess(accessToken);
        if(!userData)
        {
            return next(ApiError.UnavaliableData())
        }

        const userD = await UserService.getUser(userData.id)
        if(!userD?.rows[0]?.is_activated)
            return next(ApiError.Forbidden())

        req.user = userData;
        next();
    }catch (e)
    {
    return next(ApiError.UnavaliableData())
    }
}