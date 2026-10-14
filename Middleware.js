const jwt = require("jwt");
function authMiddleware(req,res,next){

    const token = req.headers.token 

    const decoded = jwt.verify(token , "hari123");
    const userId = decoded.userId


    if (userId){
       req.userId = userId 
       next()
    }  else {
        res.status(403).json({
            message: "malformed token"
        })
    }
    
    

}


module.exports = {
    authMiddleware: authMiddleware
}