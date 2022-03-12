class ApiError extends Error {
     status;
     errors;

     constructor(status, message, errors = []) {
         super(message);
         this.status = status;
         this.errors = errors;
     }

     static UnavaliableData(){
         return new ApiError(401, "User doesnt have access")
     }

     static BadRequest(message, errors = []){
         return new ApiError(400, message, errors);
     }

     static NotFound()
     {
         return new ApiError(404, "No data found");
     }

     static ServerException()
     {
         return new ApiError(500, "Something went wrong on server side")
     }
}

export default ApiError;