import ApiError from "../exceptions/api-error.js";
import tokenService from "../service/token.service.js";

export default function (req, res, next){
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

        const userData = tokenService.validateTokenAccess(accessToken);
        if(!userData)
        {
            return next(ApiError.UnavaliableData())
        }

        req.user = userData;
        next();
    }catch (e)
    {
    return next(ApiError.UnavaliableData())
    }
}