const jwt=require("jsonwebtoken");
const authenticateToken=(req,res,next)=>{
    const authHeader=req.headers["authentication"];
    const token=authHeader && authHeader.splite(' ')[1];
    if(token==null){
        return res.status(401).json({ message: "No token provided" });
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user=user;
        next();
    })
}

module.exports=authenticateToken;


const logger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
    next();
};

module.exports = logger;

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
};

module.exports = errorHandler;

