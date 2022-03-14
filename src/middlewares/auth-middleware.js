import ApiError from "../exceptions/api-error.js";
import tokenService from "../service/token.service.js";

export default function (req, res, next){
    try{
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader)
        {
            console.log(1)
            return next(ApiError.UnavaliableData())
        }

        const accessToken = authorizationHeader.split(' ')[1];
        console.log(accessToken, "<-- token")
        if(!accessToken)
        {
            console.log(2)
            return next(ApiError.UnavaliableData())
        }

        const userData = tokenService.validateTokenAccess(accessToken);
        if(!userData)
        {
            console.log(3)
            return next(ApiError.UnavaliableData())
        }

        req.user = userData;
        next();
    }catch (e)
    {
    return next(ApiError.UnavaliableData())
    }
}